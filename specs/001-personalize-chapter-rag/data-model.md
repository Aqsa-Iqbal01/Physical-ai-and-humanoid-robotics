# Data Model: Personalized Chapter RAG System

**Date**: 2025-12-10
**Feature**: [001-personalize-chapter-rag](specs/001-personalize-chapter-rag/spec.md)

## Entities

### User

*   **Description**: Represents an individual using the system.
*   **Attributes**:
    *   `id` (UUID/Integer): Unique identifier for the user. (Primary Key)
    *   `profile_data` (JSONB/Text): Stores user preferences, reading history, and other relevant profile information used for personalization.
    *   `total_bonus_points` (Integer): Accumulation of bonus points earned by the user.
    *   `first_personalization_completed` (Boolean): Flag indicating if the user has completed their first personalization (for bonus point logic).
*   **Relationships**:
    *   One-to-many with `PersonalizedChapter` (via `user_id`).
    *   One-to-one with `UserProgress` (via `user_id`).

### Chapter

*   **Description**: Represents an original chapter of the Docusaurus book.
*   **Attributes**:
    *   `id` (UUID/Integer): Unique identifier for the chapter. (Primary Key)
    *   `title` (String): Title of the chapter.
    *   `content` (Text): The full, original text content of the chapter.
    *   `embeddings` (Vector/JSONB): Stored embeddings of the chapter content (managed in Qdrant, but reference here).
*   **Relationships**:
    *   One-to-many with `PersonalizedChapter` (via `chapter_id`).

### PersonalizedChapter

*   **Description**: Stores a personalized version of a chapter for a specific user.
*   **Attributes**:
    *   `id` (UUID/Integer): Unique identifier for the personalized chapter record. (Primary Key)
    *   `user_id` (UUID/Integer): Foreign key referencing the `User` table.
    *   `chapter_id` (UUID/Integer): Foreign key referencing the `Chapter` table.
    *   `personalized_text` (Text): The AI-generated personalized content for the chapter.
    *   `created_at` (Timestamp): Timestamp of when the personalization occurred.
    *   `metadata` (JSONB/Text, Optional): Additional metadata about the personalization (e.g., specific prompt used, LLM version).
*   **Relationships**:
    *   Many-to-one with `User`.
    *   Many-to-one with `Chapter`.

### UserProgress

*   **Description**: Tracks user-specific progress and status related to personalization.
*   **Attributes**:
    *   `user_id` (UUID/Integer): Foreign key referencing the `User` table. (Primary Key)
    *   `personalized_chapters_count` (Integer): Count of unique chapters personalized by the user.
    *   `last_personalization_at` (Timestamp, Optional): Timestamp of the most recent personalization.
    *   `bonus_points_awarded` (Boolean): Flag indicating if the 50 bonus points have already been awarded. This could be redundant with `User.first_personalization_completed` but provides a dedicated progress status.
*   **Relationships**:
    *   One-to-one with `User`.

### Embedding

*   **Description**: Vector representation of text used for similarity search in Qdrant.
*   **Attributes**:
    *   `id` (UUID/Integer): Unique identifier for the embedding.
    *   `vector` (Array of Floats): The actual embedding vector.
    *   `text_content_ref` (UUID/String): Reference to the original text content (e.g., `chapter_id`, `personalized_chapter_id`).
    *   `source_type` (Enum: 'chapter', 'personalized_chapter'): Indicates the source of the text content.
*   **Managed by**: Qdrant.<ctrl95>