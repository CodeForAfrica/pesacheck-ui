#!/usr/bin/env python3
"""Create (or update) the `verdict_image` vocabulary in Superdesk.

The site shows a fact-check's rating illustration unless the post is tagged
`verdict_image` = `uploaded` (see `VERDICT_IMAGE_SCHEME` in lib/data/map.ts and
the `verdict_image` section of docs/superdesk-setup.md). This creates that
vocabulary; adding it to the fact-check content profile is then a UI step,
because content profiles cannot be edited through the API on this instance.

Idempotent: a vocabulary that already matches is left alone, one that differs
is patched. Dry run by default — pass --apply to write.

Usage:
  SUPERDESK_USER=… SUPERDESK_PASSWORD=… ./scripts/create-verdict-image-vocabulary.py
  SUPERDESK_USER=… SUPERDESK_PASSWORD=… ./scripts/create-verdict-image-vocabulary.py --apply

  # or with a token (`manage.py users:get_auth_token` output, or a header value)
  SUPERDESK_TOKEN=… ./scripts/create-verdict-image-vocabulary.py --apply

  # another instance (default: staging)
  SUPERDESK_API=http://localhost:5000/api ./scripts/create-verdict-image-vocabulary.py

Standard library only.
"""

import argparse
import base64
import json
import os
import sys
import urllib.error
import urllib.request

DEFAULT_API = "https://superdesk-staging.pesacheck.org/api"

# Shaped like the other single-selection subject vocabularies (faq_group,
# page_section_role): no `field_type`, so it becomes a facet of the Subject
# field and reaches Publisher as `metadata.subject[]` with this scheme.
# The qcodes are the contract with the site; the names are free to change.
VOCABULARY = {
    "_id": "verdict_image",
    "display_name": "Verdict Image",
    "type": "manageable",
    "selection_type": "single selection",
    "field_type": None,
    "unique_field": "qcode",
    "disable_entire_category_selection": False,
    "service": {"all": 1},
    "schema": {"name": {}, "parent": {}, "qcode": {}},
    "items": [
        {"is_active": True, "name": "Default", "qcode": "default"},
        {"is_active": True, "name": "Use uploaded image", "qcode": "uploaded"},
    ],
}

# Fields compared and patched on an existing vocabulary. `_id` and `type`
# cannot change, so they are only sent on create.
PATCHABLE = [k for k in VOCABULARY if k not in ("_id", "type")]


def log(msg):
    print(msg, file=sys.stderr)


class Client:
    def __init__(self, api):
        self.api = api.rstrip("/")
        self.auth = None

    def request(self, method, path, body=None, headers=None):
        hdrs = {"Accept": "application/json", "User-Agent": "pesacheck-vocabulary"}
        if self.auth:
            hdrs["Authorization"] = self.auth
        data = None
        if body is not None:
            hdrs["Content-Type"] = "application/json"
            data = json.dumps(body).encode()
        hdrs.update(headers or {})
        req = urllib.request.Request(
            f"{self.api}/{path.lstrip('/')}", data=data, method=method, headers=hdrs
        )
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read()
            return json.loads(raw) if raw else None

    def use_token(self, token):
        if token.lower().startswith(("basic ", "bearer ")):
            self.auth = token
            return
        # Superdesk's TokenAuth reads the token as the Basic-auth username.
        self.auth = "Basic " + base64.b64encode(f"{token}:".encode()).decode()

    def login(self, username, password):
        session = self.request(
            "POST", "auth_db", {"username": username, "password": password}
        )
        self.use_token(session["token"])
        return session

    def logout(self, session):
        try:
            self.request(
                "DELETE",
                f"auth_db/{session['_id']}",
                headers={"If-Match": session.get("_etag", "")},
            )
        except (urllib.error.URLError, KeyError) as exc:
            log(f"warning: could not end session ({exc}); it will expire on its own")

    def get_or_none(self, path):
        try:
            return self.request("GET", path)
        except urllib.error.HTTPError as exc:
            if exc.code == 404:
                return None
            raise


def comparable(key, value):
    """What counts as a difference. Superdesk stores items with extra
    bookkeeping keys, so items compare on qcode/name/active alone."""
    if key == "items":
        return sorted(
            (i.get("qcode"), i.get("name"), i.get("is_active", True))
            for i in value or []
        )
    return value


def differences(existing):
    return [
        k
        for k in PATCHABLE
        if comparable(k, existing.get(k)) != comparable(k, VOCABULARY[k])
    ]


def run(client, apply):
    existing = client.get_or_none(f"vocabularies/{VOCABULARY['_id']}")

    if existing is None or existing.get("_deleted"):
        log(f"verdict_image: missing → {'creating' if apply else 'would create'}")
        if apply:
            client.request("POST", "vocabularies", VOCABULARY)
    else:
        changed = differences(existing)
        if not changed:
            log("verdict_image: already up to date, nothing to do")
            return
        log(
            f"verdict_image: differs in {', '.join(changed)} → "
            f"{'patching' if apply else 'would patch'}"
        )
        if apply:
            client.request(
                "PATCH",
                f"vocabularies/{VOCABULARY['_id']}",
                {k: VOCABULARY[k] for k in changed},
                headers={"If-Match": existing["_etag"]},
            )

    if not apply:
        log("dry run: pass --apply to write")
        return

    # Read back rather than trusting the status code.
    saved = client.request("GET", f"vocabularies/{VOCABULARY['_id']}")
    left = differences(saved)
    if left:
        detail = json.dumps({k: saved.get(k) for k in left}, indent=2, default=str)
        raise SystemExit(
            f"error: saved vocabulary still differs in {', '.join(left)}:\n{detail}"
        )
    qcodes = ", ".join(i["qcode"] for i in saved["items"])
    log(f"verdict_image: saved and verified ({qcodes})")


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--apply", action="store_true", help="write (default: dry run)")
    args = parser.parse_args()

    client = Client(os.environ.get("SUPERDESK_API", DEFAULT_API))
    session = None
    token = os.environ.get("SUPERDESK_TOKEN")
    if token:
        client.use_token(token)
    else:
        user = os.environ.get("SUPERDESK_USER")
        password = os.environ.get("SUPERDESK_PASSWORD")
        if not (user and password):
            raise SystemExit(
                "error: set SUPERDESK_TOKEN, or SUPERDESK_USER and SUPERDESK_PASSWORD"
            )
        session = client.login(user, password)

    log(f"api: {client.api}")
    try:
        run(client, args.apply)
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode(errors="replace")[:500]
        raise SystemExit(f"error: {exc.code} {exc.reason} from {exc.url}\n{detail}")
    finally:
        if session:
            client.logout(session)


if __name__ == "__main__":
    main()
