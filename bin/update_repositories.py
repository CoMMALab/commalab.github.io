#!/usr/bin/env python3
"""Refresh the cached GitHub metadata in _data/repositories.yml.

For every `- repo: owner/name` entry the script fetches the repository from the
GitHub API and rewrites the `language` and `stars` lines in place. A `name` or
`description` that is already present is left alone, so hand-written titles and
blurbs survive; missing ones are filled in from the API.

The file is edited as text rather than parsed as YAML. That keeps comments,
ordering and quoting exactly as the author wrote them, and avoids a PyYAML
dependency.

Usage:
    bin/update_repositories.py [--check] [--max-age SECONDS] [--force]

    --check      report what would change and exit 1 if anything is stale,
                 without writing.
    --max-age    skip the run if the last successful refresh is newer than this
                 many seconds (default 0, meaning always refresh).
    --force      ignore --max-age.

Exit codes:
    0  nothing changed, or the run was skipped
    1  the file was updated (or, with --check, is out of date)
    2  the file could not be read or parsed

Network problems are never fatal: the script warns and exits 0 so that it can
sit in a pre-commit hook without breaking offline work.

Authentication is optional. The unauthenticated API allows 60 requests an hour,
which covers this file. To raise that limit, set GITHUB_TOKEN, or install the
GitHub CLI and log in -- `gh auth token` is used automatically.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = REPO_ROOT / "_data" / "repositories.yml"
STAMP_FILE = REPO_ROOT / ".git" / "repositories-refresh-stamp"

API = "https://api.github.com/repos/{}"
TIMEOUT = 10

# Matches `  - repo: owner/name`, capturing the indent and the slug.
ENTRY_RE = re.compile(r"^(?P<indent>\s*)-\s+repo:\s*(?P<slug>\S+)\s*$")
# Matches a `key: value` line inside an entry.
FIELD_RE = re.compile(r"^(?P<indent>\s*)(?P<key>[A-Za-z_]+):\s*(?P<value>.*)$")

# Fields refreshed on every run vs. only filled in when absent.
OVERWRITE_FIELDS = ("language", "stars")
FILL_FIELDS = ("name", "description")
FIELD_ORDER = ("name", "description", "language", "stars")


def warn(message: str) -> None:
    print(f"update_repositories: {message}", file=sys.stderr)


def github_token() -> str | None:
    """Find a token from the environment, falling back to the GitHub CLI."""
    for var in ("GITHUB_TOKEN", "GH_TOKEN"):
        token = os.environ.get(var)
        if token:
            return token
    try:
        result = subprocess.run(
            ["gh", "auth", "token"],
            capture_output=True,
            text=True,
            timeout=TIMEOUT,
        )
    except (OSError, subprocess.SubprocessError):
        return None
    token = result.stdout.strip()
    return token if result.returncode == 0 and token else None


def fetch(slug: str, token: str | None) -> dict | None:
    """Return the API payload for `owner/name`, or None if it is unavailable."""
    request = urllib.request.Request(API.format(slug))
    request.add_header("Accept", "application/vnd.github+json")
    request.add_header("User-Agent", "commalab-website-repo-refresh")
    if token:
        request.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        if error.code == 403 and error.headers.get("x-ratelimit-remaining") == "0":
            raise RateLimited(slug) from error
        warn(f"{slug}: HTTP {error.code} {error.reason}")
        return None
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, OSError) as error:
        raise Unreachable(str(error)) from error


class RateLimited(Exception):
    """The GitHub API rate limit is exhausted."""


class Unreachable(Exception):
    """The GitHub API could not be reached at all."""


def quote(value: str) -> str:
    """Render a YAML scalar, quoting only when the plain form is ambiguous."""
    text = str(value).strip()
    if not text:
        return '""'
    needs_quotes = (
        text[0] in "-?:,[]{}#&*!|>'\"%@`"
        or ": " in text
        or " #" in text
        or text != text.strip()
        or text.lower() in {"true", "false", "null", "yes", "no", "on", "off", "~"}
    )
    if needs_quotes:
        return '"' + text.replace("\\", "\\\\").replace('"', '\\"') + '"'
    return text


def split_entries(lines: list[str]) -> list[tuple[int, int, str]]:
    """Return (start, end, slug) line spans, one per `- repo:` entry."""
    entries: list[tuple[int, int, str]] = []
    for index, line in enumerate(lines):
        match = ENTRY_RE.match(line)
        if not match:
            continue
        if entries:
            start, _, slug = entries[-1]
            entries[-1] = (start, index, slug)
        entries.append((index, len(lines), match.group("slug")))
    # An entry ends at the first line that is not one of its fields.
    fixed: list[tuple[int, int, str]] = []
    for start, limit, slug in entries:
        end = start + 1
        while end < limit:
            field = FIELD_RE.match(lines[end])
            if not field or len(field.group("indent")) <= len(ENTRY_RE.match(lines[start]).group("indent")):
                break
            end += 1
        fixed.append((start, end, slug))
    return fixed


def payload_fields(data: dict) -> dict[str, str]:
    """Pull the fields we care about out of an API payload."""
    fields = {
        "name": data.get("name") or "",
        "description": (data.get("description") or "").strip(),
        "language": data.get("language") or "",
        "stars": str(data.get("stargazers_count", "")),
    }
    if fields["description"] and not fields["description"].endswith((".", "!", "?")):
        fields["description"] += "."
    return {key: value for key, value in fields.items() if value}


def update_entry(lines: list[str], start: int, end: int, fresh: dict[str, str]) -> list[str]:
    """Rewrite one entry's field lines, returning the replacement block."""
    head = lines[start]
    field_indent = " " * (len(ENTRY_RE.match(head).group("indent")) + 2)

    present: dict[str, int] = {}
    for index in range(start + 1, end):
        field = FIELD_RE.match(lines[index])
        if field:
            present[field.group("key")] = index

    block = list(lines[start:end])
    for key, value in fresh.items():
        if key in present:
            if key not in OVERWRITE_FIELDS:
                continue
            offset = present[key] - start
            field = FIELD_RE.match(block[offset])
            block[offset] = f"{field.group('indent')}{key}: {quote(value)}"
        elif key in FILL_FIELDS or key in OVERWRITE_FIELDS:
            block.append(f"{field_indent}{key}: {quote(value)}")

    # Keep the field order stable so diffs stay small.
    body = block[1:]
    ordered = sorted(
        body,
        key=lambda line: FIELD_ORDER.index(FIELD_RE.match(line).group("key"))
        if FIELD_RE.match(line) and FIELD_RE.match(line).group("key") in FIELD_ORDER
        else len(FIELD_ORDER),
    )
    return [block[0]] + ordered


def refresh(text: str, token: str | None) -> tuple[str, list[str]]:
    """Return the updated file text and a list of human-readable changes."""
    lines = text.splitlines()
    entries = split_entries(lines)
    if not entries:
        raise ValueError("no `- repo: owner/name` entries found")

    changes: list[str] = []
    # Rebuild back to front so earlier line numbers stay valid.
    for start, end, slug in reversed(entries):
        try:
            data = fetch(slug, token)
        except RateLimited:
            warn("GitHub API rate limit reached; set GITHUB_TOKEN to raise it")
            break
        if data is None:
            continue

        full_name = data.get("full_name")
        if full_name and full_name.lower() != slug.lower():
            warn(f"{slug} now redirects to {full_name}; update the `repo:` line by hand")

        before = lines[start:end]
        after = update_entry(lines, start, end, payload_fields(data))
        if after != before:
            changes.append(slug)
        lines[start:end] = after

    updated = "\n".join(lines)
    if text.endswith("\n"):
        updated += "\n"
    return updated, changes


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="report staleness without writing")
    parser.add_argument("--max-age", type=int, default=0, help="skip if refreshed this recently")
    parser.add_argument("--force", action="store_true", help="ignore --max-age")
    args = parser.parse_args()

    if args.max_age and not args.force and STAMP_FILE.exists():
        age = time.time() - STAMP_FILE.stat().st_mtime
        if age < args.max_age:
            return 0

    try:
        original = DATA_FILE.read_text(encoding="utf-8")
    except OSError as error:
        warn(f"cannot read {DATA_FILE}: {error}")
        return 2

    try:
        updated, changes = refresh(original, github_token())
    except Unreachable as error:
        warn(f"GitHub is unreachable ({error}); keeping the cached values")
        return 0
    except ValueError as error:
        warn(f"cannot parse {DATA_FILE}: {error}")
        return 2

    if updated == original:
        STAMP_FILE.parent.mkdir(parents=True, exist_ok=True)
        STAMP_FILE.touch()
        return 0

    if args.check:
        warn(f"stale metadata for: {', '.join(sorted(changes))}")
        return 1

    DATA_FILE.write_text(updated, encoding="utf-8")
    STAMP_FILE.parent.mkdir(parents=True, exist_ok=True)
    STAMP_FILE.touch()
    warn(f"updated: {', '.join(sorted(changes))}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
