# Implementation Plan: Personalized Chapter RAG System

**Branch**: `001-personalize-chapter-rag` | **Date**: 2025-12-10 | **Spec**: [specs/001-personalize-chapter-rag/spec.md](specs/001-personalize-chapter-rag/spec.md)
**Input**: Feature specification from `/specs/001-personalize-chapter-rag/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The primary requirement is to enable users to personalize book chapters through a Retrieval-Augmented Generation (RAG) system. First-time personalization will be rewarded with bonus points. The technical approach involves a FastAPI backend interacting with Qdrant for embeddings, OpenAI ChatKit for RAG, and Neon Postgres for data persistence. This backend will serve a Docusaurus frontend, where users will trigger the personalization via a button and view the results.

## Technical Context

**Language/Version**:
- Backend: Python 3.10+
- Frontend: JavaScript/TypeScript (React environment via Docusaurus)

**Primary Dependencies**:
- Backend: FastAPI, Uvicorn, SQLAlchemy (or similar ORM for Postgres), Qdrant client, OpenAI ChatKit libraries.
- Frontend: Docusaurus, React, Axios.

**Storage**:
- Primary Data: Neon Postgres (for users, chapters, personalized chapters, user progress).
- Vector Embeddings: Qdrant (for RAG context retrieval).

**Testing**:
- Backend: Pytest.
- Frontend: Jest, React Testing Library.

**Target Platform**:
- Backend: Linux server (containerized deployment expected).
- Frontend: Modern web browsers.

**Project Type**: Web application (Frontend + Backend).

**Performance Goals**:
- SC-001: Users successfully obtain a personalized chapter within 5 seconds of clicking the "Personalize This Chapter" button.
- SC-004: The system handles 100 concurrent personalization requests with 95th percentile response time under 7 seconds.

**Constraints**:
- Bonus points (50) are awarded strictly once per user for their first personalization action across all chapters.
- The personalization AI MUST avoid hallucination and remain strictly grounded in the provided chapter text (as per project Constitution).
- Uses Qdrant for managing and querying text embeddings (as per project Constitution).

**Scale/Scope**:
- Initial focus on core personalization flow for an unknown but scalable number of chapters and users within the Docusaurus book project.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

-   **Core Principle: Single Endpoint for Personalization**: The plan proposes a single `POST /personalize-chapter` endpoint, adhering to this principle. (PASS)
-   **Core Principle: RAG-Based Personalization**: The plan explicitly outlines the use of RAG incorporating chapter text, selected user text, and user profile data, adhering to this principle. (PASS)
-   **Core Principle: Data Persistence and Bonus Points**: The plan details storing personalized versions and bonus points in Neon Postgres, adhering to this principle. (PASS)
-   **Core Principle: Qdrant for Embeddings**: The plan confirms Qdrant will be used for embeddings, adhering to this principle. (PASS)
-   **Core Principle: Grounded Responses**: The plan reiterates that the personalization AI must avoid hallucination and stay grounded, adhering to this principle. (PASS)
-   **Core Principle: Modularity, Cleanliness, and Production Safety**: The proposed architecture (separate backend/frontend, distinct service/router layers) supports modular, clean, and production-safe development, adhering to this principle. (PASS)
-   **Technology Stack**: The plan's technology choices (FastAPI, Neon Postgres, Qdrant, OpenAI ChatKit, Docusaurus, React, Axios, JWT) are consistent with the Constitution's specified stack. (PASS)
-   **Project Goal**: The plan directly implements the project goal of enabling chapter personalization and bonus points. (PASS)

## Project Structure

### Documentation (this feature)

```text
specs/001-personalize-chapter-rag/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├───src/
│   ├── api/personalization_router.py   # New endpoint for personalization
│   ├── services/rag_service.py        # RAG logic, Qdrant, ChatKit integration
│   ├── models/                           # Pydantic models for request/response, DB models
│   ├── db/                               # DB connection, ORM setup
│   └── schemas/                          # For Pydantic models (request/response)
└───tests/                                # New tests for personalization
    ├── unit/
    └── integration/

frontend/
├───src/
│   ├── components/PersonalizationButton.jsx  # Button and modal component
│   ├── services/personalization_api.js       # Axios calls to backend
│   ├── pages/                                # If a dedicated page is needed (e.g., specific personalization UI)
│   └── context/AuthContext.js                # Existing authentication context for user_id
└───tests/
    ├── unit/
    └── e2e/
```

**Structure Decision**: The "Web application" option is selected and adapted to the existing `backend/` and `frontend/` project directories. New files and directories are specified within these existing structures to maintain project coherence.

