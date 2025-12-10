from fastapi.testclient import TestClient
from backend.main import app
from better_auth_client import get_user, login_user # Import necessary functions

# Mock the better_auth_client functions for testing
def mock_get_user(token: str):
    if token == "valid_token":
        return {"id": "test_user", "email": "test@example.com"}
    return None

def mock_login_user(email, password):
    if email == "test@example.com" and password == "testpassword":
        return {"access_token": "valid_token", "token_type": "bearer"}
    return None

# Apply mocks
app.dependency_overrides[get_user] = mock_get_user
app.dependency_overrides[login_user] = mock_login_user


client = TestClient(app)

# Create a dummy chapter file for testing
def setup_module(module):
    chapter_content = "# Test Chapter 1\nThis is a test chapter."
    with open("../my-website/docs/chapters/Test Chapter 1.md", "w") as f:
        f.write(chapter_content)

# Remove the dummy chapter file after testing
def teardown_module(module):
    import os
    os.remove("../my-website/docs/chapters/Test Chapter 1.md")


def test_get_chapter_unauthenticated():
    response = client.get("/api/chapters/Test Chapter 1")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

def test_get_chapter_authenticated():
    # First, get a token (mocked)
    login_response = client.post(
        "/api/auth/login", data={"username": "test@example.com", "password": "testpassword"}
    )
    token = login_response.json()["access_token"]

    response = client.get(
        "/api/chapters/Test Chapter 1",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Test Chapter 1"
    assert "This is a test chapter." in response.json()["content"]

def test_get_nonexistent_chapter():
    # First, get a token (mocked)
    login_response = client.post(
        "/api/auth/login", data={"username": "test@example.com", "password": "testpassword"}
    )
    token = login_response.json()["access_token"]

    response = client.get(
        "/api/chapters/NonExistent Chapter",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "Chapter not found"}
