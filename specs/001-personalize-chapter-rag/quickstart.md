# Quickstart Guide: Personalized Chapter RAG System

**Date**: 2025-12-10
**Feature**: [001-personalize-chapter-rag](specs/001-personalize-chapter-rag/spec.md)

This guide provides steps to quickly set up and test the Personalized Chapter RAG System feature.

## 1. Prerequisites

Ensure you have the following installed and configured:
*   Python 3.10+
*   Node.js (LTS version)
*   Git
*   Docker (for local Qdrant and Neon Postgres setup, or access to cloud instances)
*   OpenAI API Key (for ChatKit Agent)

## 2. Environment Setup

### Clone the Repository
```bash
git clone <repository_url>
cd my-book
git checkout 001-personalize-chapter-rag
```

### Backend Setup (FastAPI)
Navigate to the `backend/` directory:
```bash
cd backend
```
Create and activate a Python virtual environment:
```bash
python -m venv venv
./venv/Scripts/activate # On Windows
source venv/bin/activate # On macOS/Linux
```
Install backend dependencies:
```bash
pip install -r requirements.txt
```
Configure environment variables for Neon Postgres connection, Qdrant client, and OpenAI API key. Refer to `.env.example` in the backend directory for required variables.

### Frontend Setup (Docusaurus/React)
Navigate to the `my-website/` directory:
```bash
cd ../my-website
```
Install frontend dependencies:
```bash
npm install
```

### Database Setup
*   **Neon Postgres**: Ensure your Neon Postgres instance is running and accessible from the backend. Populate initial `users` and `chapters` data.
*   **Qdrant**: Ensure your Qdrant instance is running and accessible. Initialize necessary collections for storing chapter and personalized chapter embeddings.

## 3. Running the Application

### Start Backend
From the `backend/` directory, run the FastAPI application:
```bash
uvicorn main:app --reload
```
The backend API should be accessible at `http://localhost:8000`.

### Start Frontend
From the `my-website/` directory, start the Docusaurus development server:
```bash
npm start
```
The Docusaurus website should be accessible at `http://localhost:3000`.

## 4. Testing the Personalization Feature

1.  **Access the Frontend**: Open your web browser and navigate to `http://localhost:3000`.
2.  **Login**: Ensure you are logged in as a user with an associated `user_id`. (Authentication flow will be handled by existing system).
3.  **Navigate to a Chapter**: Browse to any book chapter page.
4.  **Click "Personalize This Chapter"**: Locate and click the personalization button.
5.  **Observe Output**:
    *   The personalized content for the chapter should appear.
    *   A message indicating if 50 bonus points were awarded should be displayed (only for the very first personalization).

## 5. API Endpoint Interaction (Optional)

You can also test the backend API directly using tools like Postman or `curl`.

**Endpoint**: `POST http://localhost:8000/personalize-chapter`

**Request Body Example**:
```json
{
  "user_id": "your-user-uuid",
  "chapter_id": "your-chapter-uuid",
  "selected_text": "Optional text you want to emphasize for personalization"
}
```

**Expected Response (200 OK)**:
```json
{
  "personalized_text": "Your AI-generated personalized chapter content...",
  "awarded_bonus": true,
  "points_added": 50
}
```
Or for subsequent personalizations:
```json
{
  "personalized_text": "Your AI-generated personalized chapter content...",
  "awarded_bonus": false,
  "points_added": 0
}
```