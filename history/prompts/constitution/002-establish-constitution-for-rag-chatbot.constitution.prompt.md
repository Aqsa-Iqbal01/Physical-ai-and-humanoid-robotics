---
id: 002
title: Establish Constitution for RAG Chatbot
stage: constitution
date: 2025-12-07
surface: agent
model: gemini
feature: 001-ai-robotics-book
branch: main
user: Aqsa Iqbal
command: /sp.constitution
labels: [constitution, rag, chatbot]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

/sp.constitution You are the Spec-Kit Plus Agent responsible for adding a Retrieval-Augmented Generation (RAG) chatbot to my existing Docusaurus book on Physical AI & Humanoid Robotics. The chatbot must:
- Answer user questions using Qdrant retrieval + OpenAI/Claude embeddings
- Support 'selected text only' mode (answers must come only from highlighted text)
- Include FastAPI backend endpoints (/ask, /index)
- Include Neon Postgres for user profiles and history
- Include a React ChatKit frontend widget embedded in the book
- Be production-ready, clean, and fully deployable

## Response snapshot

I have updated the project constitution to version 1.0.0, incorporating the core principles for the new RAG chatbot feature as requested. The constitution now reflects the requirements for the chatbot's backend, frontend, data persistence, and AI models.

## Outcome

- ✅ Impact: Established the project constitution with core principles for the RAG chatbot.
- 🧪 Tests: none
- 📁 Files: .specify/memory/constitution.md
- 🔁 Next prompts: Suggest running `/sp.specify` to define the RAG chatbot feature in more detail.
- 🧠 Reflection: The user's request was clear and provided enough detail to create a solid set of founding principles for the new feature.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
