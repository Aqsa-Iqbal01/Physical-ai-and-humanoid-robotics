# Implementation Plan: BetterAuth Integration and Personalization

**Branch**: `feature/betterauth-bonus-points` | **Date**: 2025-12-09 | **Spec**: [specs/betterauth-bonus-points/spec.md](spec.md)
**Input**: Feature specification from `specs/betterauth-bonus-points/spec.md`

## Summary

This plan outlines the implementation of a full authentication and personalization system using `better-auth.com`. It involves creating new frontend components and backend endpoints to handle user signup, signin, and profile management. The core goal is to replace the existing stubbed authentication with a full-fledged service and use the collected user background data to tailor the application experience.

## Technical Context

**Language/Version**: 
- Frontend: TypeScript/JavaScript (React)
- Backend: Python 3.9+ (FastAPI)

**Primary Dependencies**: 
- Frontend: React, Docusaurus, `better-auth-client` (hypothetical SDK)
- Backend: FastAPI, `requests` (for proxying to BetterAuth)

**Storage**: 
- User identity will be managed by `better-auth.com`.
- User profile metadata (software/hardware background) will be stored in the BetterAuth user's metadata object.

**Testing**: 
- Frontend: React Testing Library.
- Backend: `pytest`.

**Target Platform**: Web application.

**Project Type**: Web application (frontend + backend).

**Constraints**: The implementation must not break any existing functionality in the `my-website` Docusaurus application. All auth logic should be cleanly integrated without side effects.

## Project Structure

### Documentation (this feature)

```text
specs/betterauth-bonus-points/
├── plan.md              # This file
├── spec.md              # The feature specification
└── checklists/
    └── requirements.md  # The requirements checklist
```

### Source Code (repository root)

The project follows a standard web application structure with a separate `frontend` (Docusaurus/React) and `backend` (FastAPI).

```text
backend/
├── main.py                     # Modified: To include the new auth router
├── auth_router.py              # Created: To handle /auth/* endpoints
└── better_auth_client.py       # Created: A client to communicate with BetterAuth API

frontend/
└── src/
    ├── context/
    │   └── AuthContext.js      # Modified: Centralize all auth logic and API calls here
    ├── components/
    │   └── Auth/
    │       ├── SignIn.js       # Modified: Refactor to use AuthContext, remove local state/fetch
    │       └── SignUp.js       # Modified: Refactor to use AuthContext, update form fields
    └── pages/
        ├── login.tsx           # No changes needed (already uses component)
        └── signup.tsx          # No changes needed (already uses component)
```

**Structure Decision**: The plan is to modify the existing structure. New backend logic will be modularized in its own router (`auth_router.py`) and service (`better_auth_client.py`). On the frontend, logic will be consolidated into the existing `AuthContext.js` to create a single source of truth, and the UI components will be refactored to use this context, making them cleaner and more maintainable.

## Architecture and Design

### 1. Backend API (FastAPI Proxy to BetterAuth)

The backend will act as a secure proxy to the BetterAuth service to avoid exposing API keys on the frontend.

**File: `backend/auth_router.py`**
- **`POST /auth/signup`**:
  - **Request Body**: `{ email, password, software_background: {...}, hardware_background: {...} }`
  - **Logic**: 
    1. Validates the incoming data.
    2. Calls the `better_auth_client.create_user` function, passing the credentials and the background info structured as a JSON object for the metadata field.
    3. Returns the newly created user object from BetterAuth or an error.
- **`POST /auth/login`**:
  - **Request Body**: `{ email, password }` (or OAuth token flow if BetterAuth supports it)
  - **Logic**:
    1. Forwards the credentials to the `better_auth_client.login_user` function.
    2. Returns a JWT or session token provided by BetterAuth.
- **`GET /auth/me`**:
  - **Authorization**: `Bearer <token>`
  - **Logic**:
    1. Extracts the token from the header.
    2. Calls `better_auth_client.get_user` with the token.
    3. Returns the user object, including the profile metadata.

**File: `backend/better_auth_client.py`**
- This module will contain functions that wrap HTTP requests to the `better-auth.com` API.
- It will read the BetterAuth API key from environment variables.
- Functions: `create_user`, `login_user`, `get_user`.

### 2. Frontend (React)

**File: `my-website/src/context/AuthContext.js`**
- The existing `login` and `signup` functions will be updated to call our new backend endpoints (`/auth/login`, `/auth/signup`).
- The `fetchUser` function will be updated to call `/auth/me`.
- The `user` object in the context's state will now contain the detailed `software_background` and `hardware_background` objects.

**File: `my-website/src/components/Auth/SignUp.js`**
- The simple `<textarea>` fields for background information will be replaced with more structured form inputs:
  - **Experience Level**: Dropdown (`<select>`) with options: "Beginner", "Intermediate", "Expert".
  - **Programming Languages**: Checkboxes or a multi-select component for common languages (Python, JS, C++, etc.).
  - **AI Experience**: Dropdown with options: "None", "Some", "Proficient".
  - **GPU Availability**: Radio buttons ("Yes", "No").
  - **Electronics/Robotics Knowledge**: Dropdown ("None", "Some", "Proficient").
  - **Microcontroller Experience**: Checkboxes or a multi-select (Arduino, Raspberry Pi, ESP32, etc.).
- The component's `handleSubmit` function will be refactored to call `signup` from the `useAuth()` hook, passing the structured background data. All local fetch logic will be removed.

**File: `my-website/src/components/Auth/SignIn.js`**
- The component's `handleSubmit` function will be refactored to call `login` from the `useAuth()` hook. All local fetch logic and `localStorage` manipulation will be removed.

### 3. Personalization

- Any component that needs to display personalized content can import and use the `useAuth` hook.
- **Example (`ChatWidget/index.tsx`)**:
  ```javascript
  import { useAuth } from '@site/src/context/AuthContext';

  function ChatWidget() {
    const { user } = useAuth();

    let greeting = "Hello!";
    if (user && user.software_background.experience_level === 'Expert') {
      greeting = "Greetings, expert! Ready for a deep dive?";
    }

    // ... rest of the component
  }
  ```
This completes the high-level plan for implementing the feature.
