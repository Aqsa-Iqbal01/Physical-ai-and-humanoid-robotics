# backend/better_auth_client.py
import os
import requests
from dotenv import load_dotenv

# Explicitly load .env from the current directory of better_auth_client.py
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path=dotenv_path)

BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET")
# In a real scenario, this would be the actual API base URL.
# Since it's hypothetical, we'll use a placeholder.
BETTER_AUTH_SECRET = "https://api.better-auth.com/v1"

# This is a mock client. In a real-world scenario, this would make actual HTTP requests
# to the BetterAuth service. The responses are simulated for this implementation.

def create_user(email: str, password: str, metadata: dict):
    """
    Simulates creating a user in the BetterAuth service.
    """
    print(f"SIMULATING: Creating user {email} with BetterAuth.")
    if not BETTER_AUTH_SECRET:
        raise ValueError("BETTER_AUTH_API_KEY is not set.")
    
    # In a real implementation, you would make a request like this:
    # response = requests.post(
    #     f"{BETTER_AUTH_API_BASE}/users",
    #     headers={"Authorization": f"Bearer {BETTER_AUTH_API_KEY}"},
    #     json={"email": email, "password": password, "metadata": metadata}
    # )
    # response.raise_for_status()
    # return response.json()

    # Mock response:
    return {
        "id": "user_12345",
        "email": email,
        "metadata": metadata
    }

def login_user(email: str, password: str):
    """
    Simulates logging in a user via the BetterAuth service.
    """
    print(f"SIMULATING: Logging in user {email}.")
    if not BETTER_AUTH_SECRET:
        raise ValueError("BETTER_AUTH_API_KEY is not set.")

    # Mock logic:
    # Always succeed for demonstration purposes as there's no state to store created users
    return {
        "access_token": "fake_better_auth_token_for_" + email,
        "token_type": "bearer"
    }

def get_user(token: str):
    """
    Simulates fetching a user from BetterAuth using a token.
    """
    print(f"SIMULATING: Fetching user with token {token}.")
    if not BETTER_AUTH_SECRET:
        raise ValueError("BETTER_AUTH_API_KEY is not set.")
        
    if "fake_better_auth_token_for_" in token:
        email = token.replace("fake_better_auth_token_for_", "")
        # In a real scenario, you'd find the user by the token. Here we just mock it.
        return {
            "id": "user_12345",
            "email": email,
            "metadata": {
                "software_background": {
                    "experience_level": "expert",
                    "programming_languages": ["Python", "Go"],
                    "ai_experience": "proficient"
                },
                "hardware_background": {
                    "gpu_availability": "yes",
                    "electronics_knowledge": "proficient",
                    "microcontroller_experience": ["Raspberry Pi"]
                }
            }
        }
    else:
        return None