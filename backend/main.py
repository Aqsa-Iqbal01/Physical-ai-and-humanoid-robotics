import os
import uuid
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict
from qdrant_client import QdrantClient, models

from .auth_router import router, oauth2_scheme
from . import better_auth_client

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path=dotenv_path)

app = FastAPI()

app.include_router(router, prefix="/api")


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ENV variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_COLLECTION_NAME = os.getenv("COLLECTION_NAME", "robotics_chapters")

if not QDRANT_URL or not QDRANT_API_KEY or not OPENAI_API_KEY:
    raise Exception("Missing environment variables")

# Qdrant client
qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

from openai import OpenAI
openai_client = OpenAI(api_key=OPENAI_API_KEY)

EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIM = 1536

def get_embedding(text: str) -> List[float]:
    response = openai_client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text
    )
    return response.data[0].embedding

class AddTextRequest(BaseModel):
    text: str
    metadata: Dict = {}

class ChatRequest(BaseModel):
    question: str
    context: str

@app.on_event("startup")
async def startup_event():
    try:
        # Recreate collection
        qdrant_client.recreate_collection(
            collection_name=QDRANT_COLLECTION_NAME,
            vectors_config=models.VectorParams(
                size=EMBEDDING_DIM, distance=models.Distance.COSINE
            ),
        )
        print("Qdrant ready.")

        # ------------------------------
        # Add chapters automatically
        # ------------------------------
        chapters_dir = os.path.join(os.path.dirname(__file__), '..', 'my-website', 'docs', 'chapters')
        if os.path.exists(chapters_dir):
            for filename in os.listdir(chapters_dir):
                if filename.endswith(".md"):
                    filepath = os.path.join(chapters_dir, filename)
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Extract title from filename
                    title = os.path.splitext(filename)[0]
                    # remove chapter number
                    title = title.split(' ', 1)[1] if ' ' in title else title


                    embedding = get_embedding(content)
                    qdrant_client.upsert(
                        collection_name=QDRANT_COLLECTION_NAME,
                        points=[
                            models.PointStruct(
                                id=str(uuid.uuid4()),
                                vector=embedding,
                                payload={"text": content, "title": title},
                            )
                        ],
                    )
            print("Chapters added to Qdrant.")
        else:
            print(f"Directory not found: {chapters_dir}")

    except Exception as e:
        print("Qdrant error:", e)

@app.post("/add-text")
async def add_text(request: AddTextRequest):
    try:
        embedding = get_embedding(request.text)
        qdrant_client.upsert(
            collection_name=QDRANT_COLLECTION_NAME,
            points=[
                models.PointStruct(
                    id=str(uuid.uuid4()),  # ✅ UUID for safe point ID
                    vector=embedding,
                    payload={"text": request.text, **request.metadata},
                )
            ],
        )
        return {"message": "Text added."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        query_embedding = get_embedding(request.question)
        print("Query embedding length:", len(query_embedding))

        # ✅ Use latest Qdrant SDK method
        results = qdrant_client.search(
            collection_name=QDRANT_COLLECTION_NAME,
            query_vector=query_embedding,
            limit=3
        )

        print(f"Qdrant results: {results}")
        retrieved_texts = [hit.payload["text"] for hit in results]
        print(f"Retrieved texts: {retrieved_texts}")
        combined_context = " ".join(retrieved_texts + [request.context])
        print(f"Combined context: {combined_context}")

        messages = [
            {"role": "system", "content": "You are a helpful assistant. Your task is to answer questions based ONLY on the provided context from a book about robotics. If the answer is not present in the context, you MUST say 'I cannot answer this question based on the provided context.' Do not use any of your own knowledge."},
            {"role": "user", "content": f"Context: {combined_context}\n\nQuestion: {request.question}\n\nAnswer:"}
        ]

        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=150
        )

        answer = response.choices[0].message.content.strip()

        return {"answer": answer}

    except Exception as e:
        print("Error in /chat:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chapters/{chapter_filename}")
async def get_chapter_content(chapter_filename: str, token: str = Depends(oauth2_scheme)):
    # Verify the token to ensure the user is authenticated
    user = better_auth_client.get_user(token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")

    chapters_dir = os.path.join(os.path.dirname(__file__), '..', 'my-website', 'docs', 'chapters')
    file_path = os.path.join(chapters_dir, chapter_filename + ".md")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Chapter not found")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    return {"title": chapter_filename, "content": content}


@app.post("/ask")  # ❤️ frontend alias
async def ask_alias(request: ChatRequest):
    return await chat(request)

@app.get("/")
async def root():
    return {"message": "Backend running."}