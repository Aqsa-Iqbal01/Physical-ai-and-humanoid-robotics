# Feature Specification: Personalized Chapter RAG System

**Feature Branch**: `001-personalize-chapter-rag`  
**Created**: 2025-12-10  
**Status**: Draft  
**Input**: User description: "User clicks “Personalize This Chapter”. Frontend sends: { user_id, chapter_id, selected_text (optional) } Backend flow: - Fetch chapter text - Retrieve context from Qdrant - Fetch user profile and previous progress - Build RAG prompt - Call ChatKit Agent → get personalized chapter - Save: - personalized_chapters table - bonus points (50 only once) - embeddings in Qdrant Return: { personalized_text, awarded_bonus, points_added } DB: - users - chapters - personalized_chapters - user_progress Frontend: - Button + modal - Axios call - Show personalized content + bonus message"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Personalize a Chapter (Priority: P1)

Users want to read a chapter that is tailored to their profile and specific interests. They will click a "Personalize This Chapter" button, which will send their user ID, the chapter ID, and optionally any text they have selected within the chapter, to the backend. The system will then process this information to generate a personalized version of the chapter, and if it's their first personalization experience, they will receive bonus points. Finally, the personalized content and a message about any awarded bonus points will be displayed to the user.

**Why this priority**: This is the core functionality and delivers the primary user value. Without it, the feature does not exist.

**Independent Test**: Can be fully tested by simulating a user clicking the "Personalize This Chapter" button and verifying the personalized output and bonus point logic.

**Acceptance Scenarios**:

1.  **Given** a logged-in user and a chapter, **When** the user clicks "Personalize This Chapter" without selecting text, **Then** the system returns a personalized chapter based on the user's profile, and if it's their first personalization, awards 50 bonus points.
2.  **Given** a logged-in user, a chapter, and selected text within the chapter, **When** the user clicks "Personalize This Chapter", **Then** the system returns a personalized chapter based on the user's profile and the selected text, and if it's their first personalization, awards 50 bonus points.
3.  **Given** a logged-in user who has previously personalized a chapter, **When** the user clicks "Personalize This Chapter" for a new or existing chapter, **Then** the system returns a personalized chapter, but no additional bonus points are awarded.

---

### Edge Cases

-   **First-time personalization**: The system must correctly identify if it's the user's first personalization to award the bonus points only once.
-   **No selected text**: The system should gracefully handle cases where `selected_text` is empty or not provided, relying solely on the user profile and chapter content.
-   **Chapter not found**: The system should return an appropriate error if the `chapter_id` does not correspond to an existing chapter.
-   **User not found**: The system should return an appropriate error if the `user_id` does not correspond to an existing user.
-   **RAG agent failure**: The system should provide a fallback or error message if the ChatKit Agent fails to generate personalized content.
-   **Database write failure**: Ensure atomicity for saving personalized content and bonus points.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements



-   **FR-001**: System MUST provide a `POST /personalize-chapter` endpoint.

-   **FR-002**: System MUST accept `user_id`, `chapter_id`, and `selected_text (optional)` as input to the `personalize-chapter` endpoint.

-   **FR-003**: System MUST fetch the original chapter text based on `chapter_id`.

-   **FR-004**: System MUST retrieve relevant context from Qdrant using embeddings based on chapter content and user profile.

-   **FR-005**: System MUST fetch the user's profile and previous personalization progress.

-   **FR-006**: System MUST build a RAG prompt using fetched chapter text, Qdrant context, user profile, and optionally `selected_text`.

-   **FR-007**: System MUST call a ChatKit Agent with the constructed RAG prompt to generate a personalized chapter.

-   **FR-008**: System MUST save the generated personalized chapter text in a `personalized_chapters` data store.

-   **FR-009**: System MUST award 50 bonus points to the user only for their very first personalization action across all chapters.

-   **FR-010**: System MUST update the user's `user_progress` to reflect personalization history and accumulated bonus points.

-   **FR-011**: System MUST generate embeddings for the personalized chapter and store them in Qdrant.

-   **FR-012**: System MUST return the `personalized_text`, a boolean `awarded_bonus` (indicating if bonus points were given), and an integer `points_added` (0 or 50) from the `personalize-chapter` endpoint.

-   **FR-013**: Frontend MUST display a "Personalize This Chapter" button within each chapter view.

-   **FR-014**: Frontend MUST initiate an Axios call to `POST /personalize-chapter` with appropriate payload upon user interaction.

-   **FR-015**: Frontend MUST display the returned personalized content to the user.

-   **FR-016**: Frontend MUST display a clear message regarding awarded bonus points, if any, after personalization.



### Key Entities



-   **User**: Represents an individual using the system, associated with a unique identifier, profile information (e.g., preferences, reading history), and accumulated bonus points.

-   **Chapter**: Original content of a book chapter, identified by a unique `chapter_id`.

-   **Personalized Chapter**: A version of a chapter tailored to a specific user, identified by `user_id` and `chapter_id`, containing the personalized text.

-   **User Progress**: A record tracking a user's interaction with the personalization feature, including which chapters have been personalized and their total bonus points earned.

-   **Embedding**: Vector representation of text used by Qdrant for similarity search and context retrieval.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes



-   **SC-001**: Users successfully obtain a personalized chapter within 5 seconds of clicking the "Personalize This Chapter" button.

-   **SC-002**: The system accurately identifies and awards 50 bonus points for the first personalization experience for 100% of unique users.

-   **SC-003**: Personalized content generated is perceived as relevant and grammatically correct by 90% of users, as measured by user feedback.

-   **SC-004**: The system handles 100 concurrent personalization requests without significant degradation in response time (e.g., 95th percentile response time remains under 7 seconds).
