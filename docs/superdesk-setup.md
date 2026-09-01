# Superdesk & Publisher setup

What had to be configured in Superdesk and Publisher for this site to show live
content, and why. Companion to [`migration-plan.md`](./migration-plan.md);
the code side of the seam is described in `AGENTS.md`.

Read this before changing a content profile, renaming a content list, or
wondering why a section on the site is showing design copy instead of real
articles.

> **Staging:** Superdesk at `superdesk-staging.pesacheck.org`, Publisher's
> GraphQL at `graphql-staging.pesacheck.org/v1/graphql`, `tenant_code = 123abc`.
> Every query the site makes filters by that tenant.

## How a field in Superdesk reaches the website

Three hops, and which one a value takes is decided by how its **vocabulary** is
configured — not by the content profile:

| Vocabulary setting | Appears in Superdesk as | Arrives in Publisher as | Read in code with |
| --- | --- | --- | --- |
| `field_type: "text"` | its own field on the profile | `swp_article_extra` row (`field_name` / `value`) | `extraValue(article, name)` |
| `selection_type: "single selection"`, no `field_type` | a facet of the **Subject** field | `metadata.subject[]` entry with `scheme` | `findSubject(meta, scheme)?.name` |

This is the single most confusing part of the setup. A "subject" vocabulary
does not appear as a field of its own in the content profile editor — it feeds
the aggregate Subject field, and the profile controls which schemes that field
accepts (`schema.subject.schema.schema.scheme.allowed`).

Two consequences worth knowing before authoring:

- **Custom fields arrive as HTML.** Superdesk stores them through its editor, so
  `In person & streamed` comes back as `<p>In person &amp; streamed</p>`. The
  mappers run every custom field through `stripHtml`, which also decodes
  character references. Do not try to strip it upstream.
- **A profile enables a field only when it appears in both `editor` and
  `schema`,** keyed by the same id. `editor` is presentation (pane, order,
  width, visible label); `schema` is validation (type, required, nullable).

## Vocabularies

### `media_centre_label` — what an entry *is* on the Media Centre

A subject vocabulary (single selection). It supplies the kicker above a press
clipping, the tag on an announcement, the document kind on a research strand,
and the pill on an upcoming event.

Deliberately **not** the `01harm` taxonomy the fact-checks filter on: what an
entry *is* on this page is a different question from what harm a fact-check
addresses, and overloading `01harm` would have polluted the fact-check filters.

Items, grouped by the section that uses them:

| Section | Labels |
| --- | --- |
| Event spotlight | Workshop, Webinar, Lab, Summit, Clinic |
| Announcements | Network, Methodology, Partnership, Data |
| In research | Journal article, Working paper, Conference paper, Policy report |
| In the news | International newsrooms, Platform reporting, Sector review, Broadcast |

Untagged entries omit the label rather than printing a placeholder, so every
section renders correctly before the vocabulary is populated.

### `content_type` — which article-type page a fact-check belongs to

A subject vocabulary used by `/fact-checks/quick-reads`, `/explainers` and
`/longform` (see `lib/article-types.ts`). Current items: `explainer`,
`quickread`, `research`.

> **Gap:** `longform` is **not** in the vocabulary, so `/fact-checks/longform`
> has nothing to match and renders empty. It existed before the staging content
> reset. Add it back if that route is meant to work.

### `faq_group` — which group a question sits in on the FAQs page

A subject vocabulary (single selection). Its items are the group headings on
`/about/faqs`:

- Questions about our fact-checks
- Questions about our policies
- Questions about using the site

Groups are not configured anywhere else, and nothing sorts them. The page
derives them from the questions themselves, in the order their first question
appears in the curated list — so adding a group means adding a vocabulary item
and tagging a question with it, and list position is the only thing an editor
arranges. Dragging a question to the top of the list promotes its whole group.

Questions carrying no group tag collect in one leading group that renders
without a heading, so the page works before the vocabulary is populated.

### `ecosystem_group` and `ecosystem_role_icon`

Two subject vocabularies for the Our Ecosystem page.

`ecosystem_group` names the group an organisation sits under ("Fact-checking
networks", "Research & investigation"), derived and ordered exactly like the FAQ
groups.

`ecosystem_role_icon` chooses the icon on a "How we build the ecosystem" card.
**Its qcodes are not free text** — they must match `ECOSYSTEM_ROLE_ICONS` in
`lib/ecosystem-content.ts`, currently `announce`, `hand` and `server`. An icon
is a React component and cannot come from Superdesk, so an editor picks from
the set this build ships; a role tagged with anything else falls back to the
default rather than rendering an empty badge. **Adding a fourth icon is a code
change**, and that is the one part of these pages an editor cannot do alone.

### Team and ecosystem custom fields

All `field_type: "text"`, so each is its own field and lands in
`swp_article_extra`.

| Field id | Label | Used by |
| --- | --- | --- |
| `team_role` | Role | the job title under a staff member's name |
| `linkedin_url` | LinkedIn | turns the card's badge into a link; absent hides it |
| `partner_role` | Partner role | the pill on an ecosystem card ("Verified signatory") |
| `partner_url` | Partner website | where an entry's "Learn More" goes |

`partner_url` matters more than it looks: an entry without one falls back to
linking to its own article under `/fact-checks/`, which renders an organisation
as though it were a fact-check. Fill it in.

### Event custom fields

All `field_type: "text"`, so each is its own field and lands in
`swp_article_extra`. Names are the contract — `EVENT_FIELDS` in
`lib/data/map.ts` looks them up by exactly these ids.

| Field id | Label | Example | Used by |
| --- | --- | --- | --- |
| `event_venue` | Event venue | `Nairobi` / `Online` | line above the headline |
| `event_dates` | Event dates | `12–13 September 2026` | line above the headline |
| `event_format` | Event format | `In person & streamed` | spotlight detail row |
| `event_languages` | Event languages | `English, French, Kiswahili` | spotlight detail row |
| `event_cost` | Event cost | `Free for partner newsrooms` | spotlight detail row |
| `event_meta` | Event meta | `Nairobi · 12–13 September 2026` | **superseded**; read as a fallback |

`event_venue` and `event_dates` replaced the single pre-composed `event_meta`
line. Either half stands alone, joined with `·` when both are present. Events
authored before the split keep working because `event_meta` is still read.

Each detail field is independently optional: an unset field drops its row rather
than printing a blank, and an event with none reads as a plain feature.

## Content profiles

`Article` is the original fact-check profile and is unchanged. Six were added —
three for the Media Centre, and one each for the FAQs, team and ecosystem
pages — so authors get the fields that kind of entry actually needs and none of
the fact-check vocabularies it does not.

### Announcement

| Pane | Fields |
| --- | --- |
| Header | slugline, genre, place, priority, urgency, anpa_category, subject, ednote, authors, **Media Centre Label** |
| Content | headline, abstract, byline, dateline, body_html, sign_off |

The card renders five things: publish date, label, headline, **abstract**, and a
link to the article. The abstract is the entire visible body — one sentence that
stands alone, roughly 15 words. No feature media: announcements never render an
image, whatever is attached.

### Research Citations

| Pane | Fields |
| --- | --- |
| Header | slugline, place, authors, **Media Centre Label** |
| Content | headline, abstract, body_html, sign_off |

The strand's headline becomes the label, the abstract becomes the copy, and the
CTA opens the article itself. The accent colour comes from the strand's
**position** in the content list, cycling blue → navy → green → red; nothing in
the schema carries a colour, so reordering the list reshuffles them.

### Event

| Pane | Fields |
| --- | --- |
| Header | slugline, **Media Centre Label**, event fields (see above) |
| Content | headline, abstract, body_html, feature media, sign_off |

Headline is required (80 chars), abstract is required (400 — wider than the
other profiles because the spotlight body is a full paragraph), and feature
media is required because the spotlight is an image-led layout. Upcoming cards
show no image, so only the featured event's media is ever used.

### FAQ

| Pane | Field | Labelled | Holds |
| --- | --- | --- | --- |
| Header | slugline | — | the URL-safe id, unused by the page |
| Header | `ecosystem_group`-style CV | **FAQ Group** | the group heading |
| Content | `headline` | **Question** | the question |
| Content | `abstract` | **Answer** | the answer, and the only copy rendered |

Headline allows 120 characters rather than the 64 the other profiles use,
because questions are sentences rather than headlines; the answer is capped at
400, which is about as much as the three-column grid takes before the rows go
ragged.

**`body_html` is deliberately disabled.** An FAQ answer is one paragraph of
plain text — the page renders it into a `<dd>` and strips any markup — so a
second copy of the same text in the article body is a field authors have to
ignore, and a way for the page and the archive to disagree. `mapFaqItem` still
reads the body when the abstract is empty, but that is now a safety net for
entries authored before this profile existed rather than a supported path.

**The field ids cannot be renamed.** `headline` and `abstract` are Superdesk
built-ins, not custom fields, so `question` and `answer` are not available as
ids — an item with no `headline` has no title anywhere in Superdesk's own lists
and search. What *is* settable is the label an author sees, through
`editor.<field>.field_name` in the profile, which is why the table above lists
both.

Unlike the Media Centre profiles, this one carries no routing weight: FAQ
entries are not linked anywhere, so nothing depends on `metadata.profile` for
them. The profile exists for the authoring form and to keep the fact-check
vocabularies out of it.

### Team Member

| Pane | Fields |
| --- | --- |
| Header | slugline, **Role**, **LinkedIn** |
| Content | headline (the name), abstract (the card bio), body_html (the full biography), feature media (portrait) |

Staff have their own pages at `/about/team/<slug>`, rendered from the body —
the card's "See more" links there. The fact-check route declines this profile,
the same guard Media Centre entries have, because articles are looked up by
slug alone.

No portrait falls back to the design's grey circle rather than a stock photo.

### Ecosystem Partner

| Pane | Fields |
| --- | --- |
| Header | slugline, **Ecosystem Group**, **Partner role**, **Partner website** |
| Content | headline (the name, 60 chars), abstract (the description), feature media (the logo) |

The accent stripe comes from the entry's **position** across the whole list,
cycling blue → green → ink → red. The cycle deliberately does not restart per
group: that would open every group on blue and put identical colours either
side of a group boundary where groups are uneven.

## Content lists

Publisher content lists are the curation layer. Names are matched **exactly** —
`MEDIA_CENTRE_LISTS` in `lib/data/media-centre.ts`, `FAQ_LIST` in
`lib/data/faqs.ts`, `TEAM_LIST` in `lib/data/team.ts`, `ECOSYSTEM_LIST` and
`ECOSYSTEM_ROLES_LIST` in `lib/data/ecosystem.ts`, and the homepage equivalents
look them up by string, so renaming a list in Publisher silently drops the
section back to its static fallback.

| List | Feeds |
| --- | --- |
| `Homepage — Hero` | homepage hero |
| `Homepage — Spotlight` | homepage spotlight |
| `Homepage — Latest` | latest stories |
| `Homepage — Trending` | trending |
| `Media Centre — In Research` | research strand grid |
| `Media Centre — In the News` | press clippings |
| `Media Centre — Announcements` | announcements list |
| `Media Centre — Spotlight` | event spotlight **and** "Also coming up" |
| `About — FAQs` | every question on the FAQs page |
| `About — Team` | the "Our team" grid on the About page |
| `About — Ecosystem` | the partner cards on Our Ecosystem |
| `About — Ecosystem Roles` | the "How we build the ecosystem" cards |

Four things about how lists behave:

- **The events list carries the whole rail.** Its first item is the featured
  event; the rest become the cards beneath it. Promoting an event is a drag to
  the top. There is no second list.
- **Position is the only ordering.** Nothing sorts by date, so a finished event
  stays in the spotlight until somebody moves it. Making that self-maintaining
  needs real date fields rather than the free-text line.
- **The FAQs list carries its own grouping.** One article per question, grouped
  by `faq_group`, with group order following whichever group's question sits
  highest. Keeping a group's questions together in the list is not required,
  but interleaving them makes the order hard to predict from the list view.
- **Items are filtered to the six language routes** (`english`, `french`,
  `kiswahili`, `afaan-oromo`, `somali`, `amharic` — see `LANGUAGE_ROUTE_SLUGS`
  in `lib/data/stories.ts`). Curated lists get polluted with non-article entries
  such as team-member profiles, and there is no structural marker separating a
  language route from another collection, so the set is editorial. **An article
  published to any other route will not appear on the site even when correctly
  curated.**

## Authoring checklist

For a Media Centre entry to appear:

1. Create the item from the right content profile.
2. Fill headline and abstract; the abstract is the visible copy, not a summary.
3. Pick a **Media Centre Label**.
4. For events, fill venue and dates, plus whichever detail fields apply, and
   attach feature media if it is going in the spotlight.
5. **Publish** to one of the six language routes. Saving to a desk is not
   publishing, and Publisher only ingests on publish — an unpublished item never
   reaches the content-list picker.
6. Add it to the matching content list, in the position you want it read.

For a FAQ entry, the same steps with fewer fields: create it from the **FAQ**
profile, write the question as the headline and the answer as the abstract, pick
an **FAQ Group**, publish, and add it to `About — FAQs`.

Sections revalidate every 5 minutes (`export const revalidate = 300`); nothing
needs deploying.

## Fallback behaviour

Every section falls back independently to the design copy in
`lib/media-centre-content.ts`. An unreachable Hasura, a missing list, an empty
list and a list whose items are all on non-language routes all arrive the same
way — as nothing to show — and none of these sections has a designed empty
state. This means **a broken query looks exactly like unfinished curation**. If
a section shows copy you recognise from the design, check the list before
suspecting the code.

## Known instance problems

Recorded because they cost time to diagnose, and they are infrastructure rather
than code:

- **Content profiles cannot be edited through the API.** Every write shape was
  tried against `content_types/<id>`:

  | Request | Result |
  | --- | --- |
  | `PATCH` | 400, "the browser (or proxy) sent a request that this server could not understand" — Flask failing to parse a body that never arrived |
  | `POST` + `X-HTTP-Method-Override: PATCH` | 405, POST is not allowed on the item endpoint |
  | `PATCH` + `X-HTTP-Method-Override: PATCH` | reaches etag validation with a one-key body; 400 with a full profile document |
  | `PUT` | 403 for the admin user |

  The size-dependent behaviour of the last two points at a request-size limit on
  `PATCH` somewhere in front of the app rather than the method being blocked.
  Either way there is no way through: Eve replaces the whole `editor` object, so
  a profile edit is always a large body. **Create profiles via the API — a
  `POST` to the collection works and carries any number of fields — and make
  every later change in the Superdesk UI.**
- **Much of the Publisher REST API returns 500** on staging:
  `/api/v2/content/lists/{id}/items/`, `/api/v2/content/articles/`,
  `/api/v2/tenants/`. Content lists can be created via `POST
  /api/v2/content/lists/` but **not populated** through the API, so list
  curation is a Publisher UI task.
- `PUT` on `content_types` returns 403 for the admin user; use the override form
  above instead.

## Reproducing this on another instance

Order matters — a profile cannot reference a field that does not exist yet, and
a template cannot reference a profile that does not exist yet:

1. **Vocabularies** — `POST /api/vocabularies` for each custom field
   (`field_type: "text"`), and for the subject vocabularies
   (`selection_type: "single selection"`, no `field_type`).
2. **Content profiles** — `POST /api/content_types`, with each field present in
   both `editor` and `schema`. Copying an existing profile's entries is far more
   reliable than composing them from scratch.
3. **Templates** — Settings → Templates, tied to a profile. Prefill the desk,
   language and label so authors cannot forget them.
4. **Content lists** — `POST /api/v2/content/lists/` in Publisher with
   `{"name": …, "type": "manual"}` as JSON (form-encoded is rejected with 400),
   then populate them in the UI.

`metadata.profile` arrives in Publisher carrying the profile's **internal name**,
not the label an editor sees — and the two differ whenever the label contains a
space, so "Research Citations" arrives as `"ResearchCitations"`. Anything
matching on it must normalise, or it will work for single-word profiles and
silently fail for the rest.

That makes it a viable filter, and it would let sections select by profile
rather than depending on curated lists — same mappers, different `where`, with
lists demoted to ordering. Not implemented yet.
