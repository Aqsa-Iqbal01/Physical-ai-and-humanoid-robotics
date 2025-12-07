# Tasks: Integrated RAG Chatbot

**Input**: Design documents from `specs/002-rag-chatbot/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/openapi.yaml, research.md, quickstart.md

**Tests**: This task list includes explicit test tasks where appropriate.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure: `backend/`, `frontend/` directories at root.
- [X] T002 [P] Initialize Python backend: `cd backend && python -m venv venv && source venv/bin/activate`.
- [X] T003 [P] Initialize Node.js frontend: `cd frontend && npm install`.
- [X] T004 Create backend `requirements.txt` with initial dependencies: `fastapi`, `uvicorn`, `qdrant-client`, `psycopg2-binary`, `pydantic`. Add placeholder for LLM library. (`backend/requirements.txt`)
- [X] T005 [P] Create frontend `package.json` for React 18 and ChatKit components. (`frontend/package.json`)
- [X] T006 [P] Configure backend `.env` placeholder for `QDRANT_URL`, `QDRANT_API_KEY`, `DATABASE_URL`, `EMBEDDING_MODEL_API_KEY`. (`backend/.env`)
- [X] T007 [P] Configure frontend `.env.local` placeholder for `REACT_APP_API_URL`. (`frontend/.env.local`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Implement basic backend FastAPI application in `backend/src/main.py`.
- [X] T009 Create `User` model definition (SQLAlchemy/Pydantic) in `backend/src/models/user.py`.
- [X] T010 Create `Conversation` model definition (SQLAlchemy/Pydantic) in `backend/src/models/conversation.py`.
- [X] T011 Create `Message` model definition (SQLAlchemy/Pydantic) in `backend/src/models/message.py`.
- [X] T012 Implement Postgres database connection and session management in `backend/src/db.py`.
- [ ] T013 Implement database migrations for User, Conversation, Message models (e.g., using Alembic).
- [ ] T014 Implement Qdrant client initialization and connection in `backend/src/qdrant_client.py`.
- [ ] T015 Implement embedding model client (placeholder for chosen LLM) in `backend/src/embedding_client.py`.
- [ ] T016 Research: Compare OpenAI vs. Claude embedding models for performance, cost, and ease of use with Qdrant. (Update `specs/002-rag-chatbot/research.md` with findings and decision).

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Chatbot Interaction (P1) 🎯 MVP

**Goal**: Enable users to ask questions and receive answers from the book content.

**Independent Test**: Ask a variety of questions and verify relevance of answers.

### Implementation for User Story 1

- [ ] T017 [US1] Implement `/ask` endpoint logic in `backend/src/api/ask.py` to receive user question and return a generated answer.
- [ ] T018 [US1] Implement basic RAG logic: vector search in Qdrant, retrieve top-k document chunks, send chunks and question to LLM for answer generation. (Integrate with `backend/src/embedding_client.py` and `backend/src/qdrant_client.py`).
- [ ] T019 [US1] Integrate `User`, `Conversation`, `Message` models with `/ask` endpoint to store questions and answers. (Use `user_id` from request).
- [ ] T020 [US1] Create basic React Chat widget component in `frontend/src/components/ChatWidget.js`.
- [ ] T021 [US1] Implement API call from frontend widget to `backend/ask` endpoint, handling request and response.
- [ ] T022 [US1] Embed chat widget into Docusaurus chapter pages (modify Docusaurus theme/layout).

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Selected Text Mode (P2)

**Goal**: Allow users to get answers restricted to highlighted text.

**Independent Test**: Highlight text, ask a question, and verify the answer is from the highlighted content only.

### Implementation for User Story 2

- [ ] T023 [US2] Extend `/ask` endpoint in `backend/src/api/ask.py` to accept an optional `selected_text` parameter.
- [ ] T024 [US2] Modify RAG logic to prioritize or exclusively use `selected_text` during answer generation when provided. (Update `backend/src/api/ask.py`).
- [ ] T025 [US2] Enhance frontend chat widget to detect highlighted text and include it in the `/ask` API request. (`frontend/src/components/ChatWidget.js`).

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View Chat History (P3)

**Goal**: Allow users to view their past conversations.

**Independent Test**: Have a conversation, close/reopen widget, verify history appears.

### Implementation for User Story 3

- [ ] T026 [US3] Implement new endpoint (e.g., `/history`) in `backend/src/api/history.py` to fetch chat history for a given `user_id`.
- [ ] T027 [US3] Integrate history fetching into frontend chat widget on load. (`frontend/src/components/ChatWidget.js`).
- [ ] T028 [US3] Display retrieved chat history in the frontend widget. (`frontend/src/components/ChatWidget.js`).

**Checkpoint**: All user stories 1, 2, and 3 should now be independently functional

---

## Phase 6: User Story 4 - Administrator Content Indexing (P4)

**Goal**: Enable administrators to update the chatbot's knowledge base.

**Independent Test**: Call indexing endpoint, then ask about newly indexed content.

### Implementation for User Story 4

- [ ] T029 [US4] Implement `/index` endpoint in `backend/src/api/index.py` to trigger content indexing.
- [ ] T030 [US4] Implement content loading from Docusaurus book files (Markdown) within `backend/src/services/indexing_service.py`.
- [ ] T031 [US4] Implement text chunking logic for loaded content. (`backend/src/services/indexing_service.py`).
- [ ] T032 [US4] Implement embedding generation for chunks using the chosen embedding model. (`backend/src/services/indexing_service.py`).
- [ ] T033 [US4] Implement storage of embedded chunks into Qdrant vector database. (`backend/src/services/indexing_service.py`).

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T034 [P] Add comprehensive error handling to backend API endpoints. (`backend/src/main.py`, `backend/src/api/*.py`).
- [ ] T035 [P] Implement structured logging for backend operations. (`backend/src/main.py`, `backend/src/services/*.py`).
- [ ] T036 [P] Write unit tests for all backend models and services. (`backend/tests/`).
- [ ] T037 [P] Write integration tests for backend API endpoints. (`backend/tests/`).
- [ ] T038 [P] Write frontend unit tests for React components. (`frontend/src/components/*.test.js`).
- [ ] T039 Update `quickstart.md` with detailed database migration instructions and the chosen embedding model. (`specs/002-rag-chatbot/quickstart.md`).
- [ ] T040 Update `research.md` with the final decision and rationale for the chosen embedding model. (`specs/002-rag-chatbot/research.md`).
- [ ] T041 Document deployment steps for backend (Vercel/Render) and frontend (GitHub Pages). (`docs/deployment.md` or similar).
- [ ] T042 Final review of all generated documentation (`spec.md`, `plan.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`, `tasks.md`). (`specs/002-rag-chatbot/`).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for core `/ask` endpoint
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 for basic conversation flow
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Independent of other user stories for implementation, but indexing is critical for all.

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- Tasks T009-T012 in Foundational can be done in parallel once the backend application (T008) is set up.
- Once Foundational phase completes, User Stories 1, 3 and 4 can start in parallel (if team capacity allows). User Story 2 depends on User Story 1.
- All tasks within Phase 7 marked [P] can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (then User Story 2)
   - Developer B: User Story 3
   - Developer C: User Story 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
