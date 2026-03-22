"""
services/chat.py — Sendbird chat service
All Sendbird REST API calls live here. The API key never touches the frontend.
"""
import os
import logging
import requests

logger = logging.getLogger(__name__)

SENDBIRD_API_KEY = os.getenv("SENDBIRD_API_KEY")
SENDBIRD_APP_ID = os.getenv("SENDBIRD_APP_ID")
SENDBIRD_API_URL = os.getenv("SENDBIRD_API_URL", f"https://api-{SENDBIRD_APP_ID}.sendbird.com")

HEADERS = {
    "Api-Token": SENDBIRD_API_KEY,
    "Content-Type": "application/json",
}


def upsert_user(user_id: str, nickname: str) -> dict:
    """
    Creates or updates a Sendbird user.
    Called once after the user successfully completes onboarding.
    """
    url = f"{SENDBIRD_API_URL}/v3/users"
    payload = {
        "user_id": user_id,
        "nickname": nickname,
        "profile_url": "",
        "issue_access_token": True,
    }
    try:
        # Try create first
        res = requests.post(url, json=payload, headers=HEADERS, timeout=10)
        if res.status_code == 400 and "already exists" in res.text.lower():
            # Update existing user
            update_url = f"{url}/{user_id}"
            res = requests.put(update_url, json={"nickname": nickname}, headers=HEADERS, timeout=10)
        res.raise_for_status()
        data = res.json()
        logger.info(f"Sendbird user upserted: {user_id} ({nickname})")
        return {"access_token": data.get("access_token"), "user_id": user_id}
    except requests.RequestException as e:
        logger.error(f"Sendbird upsert_user failed for {user_id}: {e}")
        raise


def get_access_token(user_id: str) -> str:
    """
    Issues a new Sendbird session token for an existing user.
    Called on login.
    """
    url = f"{SENDBIRD_API_URL}/v3/users/{user_id}/token"
    try:
        res = requests.post(url, json={}, headers=HEADERS, timeout=10)
        res.raise_for_status()
        token = res.json().get("token", "")
        logger.info(f"Sendbird access token issued for {user_id}")
        return token
    except requests.RequestException as e:
        logger.error(f"Sendbird get_access_token failed for {user_id}: {e}")
        raise


def delete_user(user_id: str) -> bool:
    """Deletes a Sendbird user (called on account deletion)."""
    url = f"{SENDBIRD_API_URL}/v3/users/{user_id}"
    try:
        res = requests.delete(url, headers=HEADERS, timeout=10)
        logger.info(f"Sendbird user deleted: {user_id} — status {res.status_code}")
        return res.status_code == 200
    except requests.RequestException as e:
        logger.error(f"Sendbird delete_user failed for {user_id}: {e}")
        return False
