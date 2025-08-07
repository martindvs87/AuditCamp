from pathlib import Path
from auditcamp.tagging import AIClient, suggest_tags, update_pages, fetch_page_content


def fake_suggest(context: str):
    return ["operations", "finance"]


def fake_merge(existing: str, new: str) -> str:
    return (existing + "\n" if existing else "") + new.strip()


def always_approve(tag: str, content: str) -> bool:
    return True


def test_suggest_tags():
    ai = AIClient(fake_suggest, fake_merge)
    tags = suggest_tags("Some context about operations", ai)
    assert "operations" in tags


def test_update_existing_page(tmp_path, monkeypatch):
    ai = AIClient(fake_suggest, fake_merge)
    # Use temporary pages directory
    monkeypatch.setattr("auditcamp.tagging.PAGES_DIR", tmp_path)
    (tmp_path / "current_year").mkdir(parents=True)
    page = tmp_path / "current_year" / "operations.md"
    page.write_text("Existing operations content.")

    saved = update_pages("current_year", "New insights", ["operations"], ai, always_approve)

    assert saved[0].read_text() == "Existing operations content.\nNew insights"


def test_update_creates_new_page(tmp_path, monkeypatch):
    ai = AIClient(fake_suggest, fake_merge)
    monkeypatch.setattr("auditcamp.tagging.PAGES_DIR", tmp_path)
    saved = update_pages("audit_knowledge", "Fresh content", ["controls"], ai, always_approve)
    assert (tmp_path / "audit_knowledge" / "controls.md").exists()
    assert saved[0].read_text() == "Fresh content"
