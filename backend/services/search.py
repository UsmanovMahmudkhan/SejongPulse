"""
services/search.py — Algolia search index service
Handle pulse indexing: create, update, delete.
The Write API key never reaches the frontend.
"""
import os
import logging
from algoliasearch.search.client import SearchClientSync

logger = logging.getLogger(__name__)

ALGOLIA_APP_ID = os.getenv("ALGOLIA_APP_ID")
ALGOLIA_WRITE_API_KEY = os.getenv("ALGOLIA_WRITE_API_KEY")
ALGOLIA_INDEX = os.getenv("ALGOLIA_PULSES_INDEX", "pulses")

_client = None


def _get_client() -> SearchClientSync:
    global _client
    if _client is None:
        _client = SearchClientSync(ALGOLIA_APP_ID, ALGOLIA_WRITE_API_KEY)
    return _client


def index_pulse(pulse_id: str, content: str, category: str, building_tag: str,
                author_pseudonym: str, created_at: str) -> None:
    """Index a newly created pulse."""
    try:
        record = {
            "objectID": pulse_id,
            "content": content,
            "category": category,
            "building_tag": building_tag,
            "author_pseudonym": author_pseudonym,
            "created_at": created_at,
            "deleted": False,
        }
        _get_client().save_object(index_name=ALGOLIA_INDEX, body=record)
        logger.info(f"Algolia indexed pulse {pulse_id}")
    except Exception as e:
        logger.error(f"Algolia index_pulse failed for {pulse_id}: {e}")


def update_pulse(pulse_id: str, content: str, category: str) -> None:
    """Update an edited pulse in the index."""
    try:
        _get_client().partial_update_object(
            index_name=ALGOLIA_INDEX,
            object_id=pulse_id,
            attributes_to_update={"content": content, "category": category},
        )
        logger.info(f"Algolia updated pulse {pulse_id}")
    except Exception as e:
        logger.error(f"Algolia update_pulse failed for {pulse_id}: {e}")


def soft_delete_pulse(pulse_id: str) -> None:
    """
    Mark a pulse as deleted in the index (mirrors the DB soft-delete).
    This removes it from search results via a Algolia filter on deleted=false.
    """
    try:
        _get_client().partial_update_object(
            index_name=ALGOLIA_INDEX,
            object_id=pulse_id,
            attributes_to_update={"deleted": True},
        )
        logger.info(f"Algolia soft-deleted pulse {pulse_id}")
    except Exception as e:
        logger.error(f"Algolia soft_delete_pulse failed for {pulse_id}: {e}")
