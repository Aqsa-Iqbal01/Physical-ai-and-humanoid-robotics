import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from qdrant_client import QdrantClient, models

# For embeddings, we can use a local model or an API-based one like OpenAI
# For this example, we'll simulate an embedding function or use a simple mock.
# In a real scenario, you'd integrate with an actual embedding model.
# from sentence_transformers import SentenceTransformer # if using local models
# from openai import OpenAI # if using OpenAI embeddings

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Initialize Qdrant client
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_COLLECTION_NAME = os.getenv("COLLECTION_NAME", "book_highlights")

if not QDRANT_URL or not QDRANT_API_KEY or not OPENAI_API_KEY:
    print("QDRANT_URL, QDRANT_API_KEY, and OPENAI_API_KEY must be set in the .env file")
    # In a production app, you might want to raise an exception or handle this more gracefully

qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

# Initialize embedding model using OpenAI
from openai import OpenAI
openai_client = OpenAI(api_key=OPENAI_API_KEY)
EMBEDDING_MODEL = "text-embedding-ada-002"
EMBEDDING_DIM = 1536 # Dimension for text-embedding-ada-002

def get_embedding(text: str) -> List[float]:
    response = openai_client.embeddings.create(input=text, model=EMBEDDING_MODEL)
    return response.data[0].embedding


# Request model for adding text/highlights
class AddTextRequest(BaseModel):
    text: str
    metadata: Dict = {}

# Request model for chat questions
class ChatRequest(BaseModel):
    question: str
    context: str = "" # User-selected highlight/context

@app.on_event("startup")
async def startup_event():
    # Ensure the Qdrant collection exists on startup
    try:
        qdrant_client.recreate_collection(
            collection_name=QDRANT_COLLECTION_NAME,
            vectors_config=models.VectorParams(size=EMBEDDING_DIM, distance=models.Distance.COSINE),
        )
        print(f"Qdrant collection '{QDRANT_COLLECTION_NAME}' ensured to exist.")
    except Exception as e:
        print(f"Could not ensure Qdrant collection '{QDRANT_COLLECTION_NAME}': {e}")

@app.post("/add-text")
async def add_text(request: AddTextRequest):
    """
    Endpoint to store new text/highlights in Qdrant.
    Generates embeddings and stores them along with the text and metadata.
    """
    try:
        embedding = get_embedding(request.text)
        qdrant_client.upsert(
            collection_name=QDRANT_COLLECTION_NAME,
            points=[
                models.PointStruct(
                    id=request.text.__hash__(), # Simple ID generation
                    vector=embedding,
                    payload={"text": request.text, **request.metadata}
                )
            ]
        ).wait()
        return {"message": "Text added successfully to Qdrant"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add text to Qdrant: {e}")

@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Endpoint to receive user questions, query Qdrant (for RAG), and return answers.
    Responses should only be based on the provided context (user-selected highlight).
    """
    if not request.context:
        raise HTTPException(status_code=400, detail="User context (highlighted text) is required for generating a response.")

    try:
        # 1. Embed the user's question
        query_embedding = get_embedding(request.question)

        # 2. Query Qdrant with the embedded question to find relevant passages
        search_result = qdrant_client.search(
            collection_name=QDRANT_COLLECTION_NAME,
            query_vector=query_embedding,
            limit=3, # Retrieve top 3 relevant passages
            query_filter=models.Filter(
                must=[
                    models.FieldCondition(
                        key="text",
                        match=models.MatchText(text=request.context)
                    )
                ]
            )
        )

        retrieved_texts = [hit.payload['text'] for hit in search_result if 'text' in hit.payload]

        # Combine user-provided context with retrieved context
        combined_context = " ".join(retrieved_texts + [request.context])

        if not combined_context.strip():
            return {"answer": "I couldn't find any relevant information based on your highlight and question."}

        # 3. Use an LLM to generate a response based *only* on the retrieved passages and the provided context.
        # This is a placeholder for actual LLM integration (e.g., using OpenAI, Anthropic, or another agent)
        # For demonstration, we'll craft a simple response.
        llm_response = f"Based on the relevant information from the book: '{combined_context}', and considering your question about '{request.question}', a potential answer is... (Full LLM integration needed here for a comprehensive answer)."

        return {"answer": llm_response}
    except Exception as e:
        print(f"Error during chat process: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during chat: {e}")

@app.get("/")
async def read_root():
    return {"message": "RAG Chatbot Backend is running!"}
