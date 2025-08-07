from __future__ import annotations
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Iterable, List, Optional


@dataclass
class AIClient:
    """Minimal protocol for AI interactions."""

    suggest_tags_fn: Callable[[str], Iterable[str]]
    merge_fn: Callable[[str, str], str]

    def suggest_tags(self, context: str) -> List[str]:
        return list(self.suggest_tags_fn(context))

    def merge(self, existing: str, new: str) -> str:
        return self.merge_fn(existing, new)


BASE_DIR = Path(__file__).resolve().parent.parent
PAGES_DIR = BASE_DIR / "pages"


def suggest_tags(context: str, ai: AIClient) -> List[str]:
    """Return a list of suggested tags for the provided context."""
    return ai.suggest_tags(context)


def fetch_page_content(category: str, tag: str) -> Optional[str]:
    """Return the existing content for the given category/tag if present."""
    path = PAGES_DIR / category / f"{tag}.md"
    if path.exists():
        return path.read_text(encoding="utf-8")
    return None


def merge_content(existing: str, new: str, ai: AIClient) -> str:
    """Use AI to merge existing and new context into markdown."""
    return ai.merge(existing, new)


def persist_page(category: str, tag: str, content: str) -> Path:
    """Write content to the appropriate page path."""
    path = PAGES_DIR / category
    path.mkdir(parents=True, exist_ok=True)
    file_path = path / f"{tag}.md"
    file_path.write_text(content, encoding="utf-8")
    return file_path


def update_pages(category: str, context: str, accepted_tags: Iterable[str], ai: AIClient,
                 approve: Callable[[str, str], bool]) -> List[Path]:
    """
    For each accepted tag, merge existing content with new context and persist
    the result if the approve callback returns True.
    """
    saved_paths: List[Path] = []
    for tag in accepted_tags:
        existing = fetch_page_content(category, tag)
        merged = merge_content(existing or "", context, ai)
        if approve(tag, merged):
            saved_paths.append(persist_page(category, tag, merged))
    return saved_paths
