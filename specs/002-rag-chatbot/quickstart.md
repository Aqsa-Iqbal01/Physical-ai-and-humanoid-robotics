# Quickstart: Integrated RAG Chatbot

This guide provides instructions for setting up and running the RAG chatbot project locally.

## Prerequisites

- Python 3.10+ and `pip`
- Node.js 18+ and `npm` or `yarn`
- Access to Qdrant Cloud (a free tier account is sufficient)
- Access to a Neon Postgres database

## 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up environment variables:**
    - Create a `.env` file in the `backend` directory.
    - Add the following variables:
      ```
      QDRANT_URL=your_qdrant_cloud_url
      QDRANT_API_KEY=your_qdrant_api_key
      DATABASE_URL=your_neon_postgres_connection_string
      EMBEDDING_MODEL_API_KEY=your_openai_or_claude_api_key
      ```

5.  **Run database migrations:**
    - (Instructions to be added on how to apply the data model to the Postgres database, e.g., using Alembic).

6.  **Run the backend server:**
    ```bash
    uvicorn src.main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

## 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    - Create a `.env.local` file in the `frontend` directory.
    - Add the backend API URL:
      ```
      REACT_APP_API_URL=http://localhost:8000
      ```

4.  **Run the frontend development server:**
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

## 3. Content Indexing

Before you can ask questions, you need to index the book's content.

1.  Make sure the backend server is running.
2.  Send a POST request to the `/index` endpoint. You can use a tool like `curl` or Postman.
    ```bash
    curl -X POST http://localhost:8000/index
    ```
3.  This will trigger the indexing process. Monitor the backend server logs for progress.

## 4. Using the Chatbot

- Once the indexing is complete, navigate to the Docusaurus book in your browser.
- The chat widget should be visible on the chapter pages.
- Ask a question and get an answer from your book!
