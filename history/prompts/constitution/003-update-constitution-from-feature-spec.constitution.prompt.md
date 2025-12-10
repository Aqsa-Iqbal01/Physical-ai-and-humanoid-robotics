---
id: 003
title: Update constitution from feature spec
stage: constitution
date: 2025-12-09
surface: agent
model: gemini
feature: rag_betterauth_project
branch: feature/auth-docusaurus
user: unknown
command: /sp.constitution
labels: [constitution, refactoring]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
  - .specify/templates/spec-template.md
  - .specify/templates/tasks-template.md
  - .claude/commands/sp.plan.md
tests:
  - none
---

## Prompt

/sp.constitution project:
  name: rag_betterauth_project
  description: "Implement Signup and Signin using BetterAuth, ask user background questions, and personalize content."

intents:
  - id: implement_betterauth
    description: "Add Signup and Signin functionality with user background questions for personalized content."
    goal: |
      Implement Signup and Signin using BetterAuth.
      During signup, ask users about their software background (experience level, programming languages, AI experience)
      and hardware background (GPU availability, electronics/robotics knowledge, microcontroller experience).
      Store this information in the user's metadata/profile.
      Use metadata after login to personalize content and chatbot responses.
      Do not modify other parts of the system.

skills:
  - id: signup_user
    type: python
    description: "Signup user and store background metadata."
    code: |
      from better_auth import BetterAuth
      auth = BetterAuth()

      def signup_user(email, password, software_background, hardware_background):
          metadata = {
              "software_background": software_background,
              "hardware_background": hardware_background
          }
          return auth.signup(email=email, password=password, metadata=metadata)

  - id: signin_user
    type: python
    description: "Signin user and retrieve metadata."
    code: |
      from better_auth import BetterAuth
      auth = BetterAuth()

      def signin_user(email, password):
          user = auth.signin(email=email, password=password)
          return user.metadata

  - id: personalize_content
    type: python
    description: "Customize content based on user's background."
    code: |
      def personalize_content(user_metadata, content):
          if user_metadata.get("software_background") == "Beginner":
              return "Beginner-friendly: " + content
          return content

subagents:
  - id: auth_agent
    role: "Handle Signup, Signin, and personalization workflow"
    skills: [signup_user, signin_user, personalize_content]

## Response snapshot

I have updated the project constitution based on the feature specification you provided. I derived a new set of principles and propagated the changes to the relevant templates. The new constitution is at version 1.0.0.

## Outcome

- ✅ Impact: The project constitution has been updated to version 1.0.0 with new principles derived from the user's feature specification. Dependent templates for planning, specification, and tasks have been updated to reflect these new principles. An outdated agent reference in a command file has been corrected.
- 🧪 Tests: none
- 📁 Files: 
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
  - .specify/templates/spec-template.md
  - .specify/templates/tasks-template.md
  - .claude/commands/sp.plan.md
- 🔁 Next prompts: none
- 🧠 Reflection: The user provided a feature specification to the /sp.constitution command. Instead of rejecting the input, I inferred a set of constitutional principles from the specification. This allowed me to fulfill the user's request while also guiding them towards the correct use of the tool.

## Evaluation notes (flywheel)

- Failure modes observed: User provided a feature specification instead of constitutional principles.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
