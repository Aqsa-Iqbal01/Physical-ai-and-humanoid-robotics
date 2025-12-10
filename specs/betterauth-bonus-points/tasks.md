# Tasks: BetterAuth Integration and Personalization

**Input**: Design documents from `specs/betterauth-bonus-points/`

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic backend structure.

- [x] T001 [P] Create the file `backend/auth_router.py`.
- [x] T002 [P] Create the file `backend/better_auth_client.py`.
- [x] T003 [P] Update `backend/requirements.txt` to include `requests`.
- [x] T004 Add `BETTER_AUTH_API_KEY=` to a `.env` file in the `backend` directory and add `.env` to `backend/.gitignore` if it's not already there.

---

## Phase 2: Foundational (Backend API Implementation)

**Purpose**: Core backend API that MUST be complete before the frontend work can be fully integrated.

- [x] T005 [P] In `backend/better_auth_client.py`, implement a client class or functions to wrap HTTP calls to the (hypothetical) `better-auth.com` API for login, signup, and fetching user data. It should read the API key from environment variables.
- [x] T006 [P] In `backend/auth_router.py`, implement the `POST /auth/login` endpoint which uses the `better_auth_client`.
- [x] T007 [P] In `backend/auth_router.py`, implement the `POST /auth/signup` endpoint which uses the `better_auth_client`.
- [x] T008 [P] In `backend/auth_router.py`, implement the `GET /auth/me` endpoint which uses the `better_auth_client`.
- [x] T009 In `backend/main.py`, import and include the `auth_router`.

**Checkpoint**: Backend foundation is ready. The new `/auth/*` endpoints should be available.

---

## Phase 3: User Story 1 - Signup (Frontend)

**Goal**: A new user can sign up with their email, password, and detailed background information.

**Independent Test**: The signup page can be used to create a new user, and the background data is correctly stored in the BetterAuth metadata.

### Implementation for User Story 1

- [x] T010 [US1] Modify `my-website/src/components/Auth/SignUp.js` to replace the simple text areas with detailed form inputs (selects, checkboxes, radios) for all the background questions specified in the `plan.md`.
- [x] T011 [US1] In `my-website/src/context/AuthContext.js`, update the `signup` function to send a `POST` request to the new `/auth/signup` backend endpoint with the detailed, structured profile data.
- [x] T012 [US1] Refactor the `handleSubmit` function in `my-website/src/components/Auth/SignUp.js` to remove its internal `fetch` logic and instead call the `signup` function from the `useAuth` hook.

**Checkpoint**: User Story 1 is functional. Users can sign up with the new form.

---

## Phase 4: User Story 2 - Signin (Frontend)

**Goal**: An existing user can sign in and their session is managed by the AuthContext.

**Independent Test**: A registered user can log in, and their user information (including profile data) becomes available in the React context.

### Implementation for User Story 2

- [x] T013 [US2] In `my-website/src/context/AuthContext.js`, update the `login` function to send a `POST` request to the new `/auth/login` backend endpoint.
- [x] T014 [US2] In `my-website/src/context/AuthContext.js`, update the `fetchUser` function to send a `GET` request to the new `/auth/me` backend endpoint to retrieve user data using the token.
- [x] T015 [US2] Refactor the `handleSubmit` function in `my-website/src/components/Auth/SignIn.js` to remove its internal `fetch` logic and `localStorage` handling, and instead call the `login` function from the `useAuth` hook.

**Checkpoint**: User Story 2 is functional. Users can sign in and their state is managed globally.

---

## Phase 5: User Story 3 - Personalization

**Goal**: The application content is personalized based on the logged-in user's background.

**Independent Test**: Log in as a "beginner" user and see simplified content. Log in as an "expert" user and see advanced content.

### Implementation for User Story 3

- [x] T016 [US3] In a component that requires personalization (e.g., `my-website/src/components/ChatWidget/index.tsx`), import and use the `useAuth` hook to get the logged-in `user` object.
- [x] T017 [US3] Access the user's profile from the `user` object (e.g., `user.software_background.experience_level`).
- [x] T018 [US3] Implement conditional rendering or logic within the component to alter its output based on the user's profile data, as described in the `plan.md`.

**Checkpoint**: User Story 3 is functional. The application experience changes based on the logged-in user.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements for robustness and quality.

- [x] T019 [P] Improve error handling in `my-website/src/context/AuthContext.js` to display user-friendly messages for failed login or signup attempts.
- [x] T020 [P] Add request body validation to the backend endpoints in `backend/auth_router.py` using Pydantic models.
- [x] T021 Ensure the BetterAuth API key is properly handled via environment variables and is not exposed in the source code.
