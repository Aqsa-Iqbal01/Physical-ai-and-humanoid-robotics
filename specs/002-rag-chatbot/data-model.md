# Data Model: Integrated RAG Chatbot

This document defines the data models for the key entities in the RAG chatbot system.

## 1. User

Represents a reader interacting with the chatbot. Since there is no authentication, the user is identified by a unique ID stored on the client.

- **`id`**: `UUID` (Primary Key). A unique identifier generated on the client-side and stored in `localStorage`.
- **`created_at`**: `Timestamp`. The time when the user first interacted with the chatbot.
- **`updated_at`**: `Timestamp`. The time of the user's last interaction.

**Example Table `users`:**
| id | created_at | updated_at |
|---|---|---|
| `f47ac10b-58cc-4372-a567-0e02b2c3d479` | `2025-12-07 18:00:00` | `2025-12-07 18:05:00` |

## 2. Conversation

Represents a single chat session. Each conversation is linked to a user.

- **`id`**: `UUID` (Primary Key).
- **`user_id`**: `UUID` (Foreign Key to `users.id`).
- **`created_at`**: `Timestamp`.

**Example Table `conversations`:**
| id | user_id | created_at |
|---|---|---|
| `a1b2c3d4-e5f6-7890-1234-567890abcdef` | `f47ac10b-58cc-4372-a567-0e02b2c3d479` | `2025-12-07 18:00:00` |

## 3. Message

Represents a single message within a conversation. It can be from the user (a question) or from the chatbot (an answer).

- **`id`**: `UUID` (Primary Key).
- **`conversation_id`**: `UUID` (Foreign Key to `conversations.id`).
- **`sender`**: `String`. Either `'user'` or `'bot'`.
- **`content`**: `Text`. The text of the message.
- **`created_at`**: `Timestamp`.

**Example Table `messages`:**
| id | conversation_id | sender | content | created_at |
|---|---|---|---|---|
| `b2c3d4e5-...` | `a1b2c3d4-...` | `user` | `What is kinematics?` | `2025-12-07 18:00:00` |
| `c3d4e5f6-...` | `a1b2c3d4-...` | `bot` | `Kinematics is the branch of mechanics...` | `2025-12-07 18:00:05` |

## 4. DocumentChunk (in Qdrant)

Represents a segment of the book's text that is embedded and stored in the Qdrant vector database. This is not a relational model but a representation of the data in the vector DB.

- **`id`**: `UUID`. A unique identifier for the chunk.
- **`vector`**: `Vector`. The embedding of the `content`.
- **`payload`**: `Object`. Metadata associated with the chunk.
  - **`content`**: `Text`. The raw text of the document chunk.
  - **`source`**: `String`. The chapter or section of the book from which the chunk was extracted.
  - **`page_number`**: `Integer`. (Optional) The page number.

## Relationships

- A `User` can have many `Conversations`.
- A `Conversation` can have many `Messages`.
- A `Conversation` belongs to one `User`.
- A `Message` belongs to one `Conversation`.
