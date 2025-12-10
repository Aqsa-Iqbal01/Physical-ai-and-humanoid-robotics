<!--
Sync Impact Report:
Version change: (initial) -> 1.0.0
Modified principles:
- PRINCIPLE_1_NAME -> Single Endpoint for Personalization
- PRINCIPLE_2_NAME -> RAG-Based Personalization
- PRINCIPLE_3_NAME -> Data Persistence and Bonus Points
- PRINCIPLE_4_NAME -> Qdrant for Embeddings
- PRINCIPLE_5_NAME -> Grounded Responses
- PRINCIPLE_6_NAME -> Modularity, Cleanliness, and Production Safety
Added sections: Technology Stack, Project Goal
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md (⚠ pending)
- .specify/templates/spec-template.md (⚠ pending)
- .specify/templates/tasks-template.md (⚠ pending)
- .claude/commands/sp.adr.md (⚠ pending)
- .claude/commands/sp.analyze.md (⚠ pending)
- .claude/commands/sp.checklist.md (⚠ pending)
- .claude/commands/sp.clarify.md (⚠ pending)
- .claude/commands/sp.constitution.md (⚠ pending)
- .claude/commands/sp.git.commit_pr.md (⚠ pending)
- .claude/commands/sp.implement.md (⚠ pending)
- .claude/commands/sp.phr.md (⚠ pending)
- .claude/commands/sp.plan.md (⚠ pending)
- .claude/commands/sp.specify.md (⚠ pending)
- .claude/commands/sp.tasks.md (⚠ pending)
Follow-up TODOs: None
-->
# Personalized RAG Chapter System Constitution

## Core Principles

### Single Endpoint for Personalization
All personalization requests MUST be handled by a single `POST /personalize-chapter` endpoint.

### RAG-Based Personalization
The personalization process MUST utilize Retrieval-Augmented Generation (RAG) incorporating chapter text, selected user text, and user profile data.

### Data Persistence and Bonus Points
Personalized chapter versions and user bonus points MUST be stored in the database. First-time personalization MUST grant +50 bonus points.

### Qdrant for Embeddings
Qdrant MUST be used for managing and querying text embeddings.

### Grounded Responses
The personalization AI MUST avoid hallucination and remain strictly grounded in the provided chapter text.

### Modularity, Cleanliness, and Production Safety
The system architecture and codebase MUST be modular, clean, well-structured, and designed for production safety.

## Technology Stack
- Backend: FastAPI, Neon Postgres, Qdrant, OpenAI ChatKit.
- Frontend: Docusaurus, React, Axios.
- Authentication: JWT.

## Project Goal
The primary goal is to enable users to personalize book chapters. Upon clicking 'Personalize This Chapter,' an AI will rewrite the chapter based on the user's profile and selected text. A +50 bonus points incentive will be awarded for the first personalization.

## Governance
This Constitution outlines the fundamental principles and guidelines governing the "Personalized RAG Chapter System" project. It supersedes all other practices and documentation where conflicts arise. Amendments to this Constitution MUST follow a documented process, including explicit approval and a plan for migrating existing practices or codebases to align with any new or modified principles. All pull requests and code reviews MUST verify compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-10