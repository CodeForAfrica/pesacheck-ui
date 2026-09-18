# Editing pages in Superdesk

Every page on the site outside the fact-check archive is built from Superdesk
content. Nothing here needs a developer: you change a page by editing articles
and reordering a list.

This is the editor-facing guide. For the administrator side — creating
vocabularies, configuring content profiles, how a field reaches the site — see
[`superdesk-setup.md`](superdesk-setup.md).

## How a page is built

A page is three things. Once you can see these, every page works the same way.

1. **A route** decides the URL. The route named `Principles` serves
   `/about/principles`. Routes are made once and rarely touched.
2. **A content list** named after the route — `Page — Principles` — *is* the
   page. What is in that list, in the order you drag it, is what appears.
3. **Sections** are the items in that list: one article each, on the
   `Page Section` profile. The headline is the section heading, the body is the
   text.

A section is either **prose** — you write the words and they appear — or it
carries a **template**, which replaces the body with something the site draws:
a grid of staff, a wall of logos, the FAQ accordion. A template pulls its
content from a second list, which is why some pages have several lists.

Two tags control this, both set in the article's **Subject** field:

| Tag | Values | What it does |
| --- | --- | --- |
| `page_section_role` | `hero`, `section`, `cta` | `hero` makes the section the banner — its headline becomes the page title, its summary the standfirst, its image the backdrop. `cta` lifts it out into the call-out bar at the foot. Everything else is `section`. |
| `page_section_template` | see each page below | Names which built-in block to draw in place of the body. Leave unset for a prose section. |

Only one section per page should be tagged `hero`. Tag none and the first item
in the list is used instead.

## Publishing a section

This order matters. A section that skips step 5 exists in Superdesk and is
nowhere on the site.

1. **Create the article** on the `Page Section` profile. Any other profile will
   not show the template and role fields.
2. **Write the slugline.** It becomes the section's anchor link and **cannot be
   changed after publishing**. Prefix it with the page name when the plain word
   is taken elsewhere — `methodology-who-we-are` rather than `who-we-are`. The
   page prefix is stripped from the anchor automatically.
3. **Fill the fields.** Headline is the section heading, body is the text. Add
   the role and template tags under Subject if the section needs them.
4. **Publish it.** A draft never reaches the site. Publish to the page's own
   route where one exists — it makes the item easy to find later, though the
   page reads its list regardless of route.
5. **Add it to the page's list** and drag it into position. List order is page
   order, top to bottom.

Changes appear within about five minutes. If a change has not shown up after
that, it is almost always step 4 or step 5.

## The pages

Twelve pages are currently served from Superdesk. "prose" means you write the
words directly; a template name means the section draws content from the list
in the last column.

### About — `/about`

List: `Page — About`

| Slugline | Role | Renders | Content from |
| --- | --- | --- | --- |
| `about-hero` | hero | prose | — |
| `about-intro` | section | `about-intro` | `Page — About — Intro Images` |
| `about-impact` | section | `impact-stats` | `Page — About — Impact` |
| `about-team` | section | `team-grid` | `Page — About — Team` |
| `about-ally-strip` | section | `ally-partner-strip` | `Page — Partners — Allies` |

The intro section's standfirst comes from its **body**, not its summary — it
runs longer than a headline allows.

### Contact Us — `/about/contact-us`

List: `Page — Contact Us`

| Slugline | Role | Renders | Content from |
| --- | --- | --- | --- |
| `contact-hero` | hero | prose | — |
| `contact-hq` | section | `contact-form` | its own `contact_address`, `contact_email`, `contact_phone` |
| `contact-locations` | section | `contact-locations` | `Page — Contact Us — Locations` |
| `contact-whatsapp` | section | `contact-whatsapp` | `Page — Contact Us — WhatsApp` |
| `contact-licensing` | section | prose | — |
| `contact-imprint` | section | `legal-sections` | `Page — Imprint — Sections` |
| `contact-fact-check` | section | `contact-fact-check` | its own body, links included |

The message form is built into the site and is not editable — only the heading
above it and the contact details beneath. The large WhatsApp number lives in
`contact_phone` on the WhatsApp section itself, not in the list.

### FAQs — `/about/faqs`

List: `Page — FAQs`

| Slugline | Role | Renders | Content from |
| --- | --- | --- | --- |
| `faqs-hero` | hero | prose | — |
| `faqs-questions` | section | `faq-questions` | `Page — FAQs — Questions` |
| `faqs-cta` | cta | prose | its `cta_url` and `cta_label` |

A section tagged `cta` with no `cta_url` quietly stays an ordinary section
rather than becoming the call-out bar.

### Media Centre — `/about/media-centre`

List: `Page — Media Centre`

| Slugline | Role | Renders | Content from |
| --- | --- | --- | --- |
| `media-centre-hero` | hero | prose | — |
| `media-centre-research` | section | `media-research` | `Page — Media Centre — In Research` |
| `media-centre-news` | section | `media-news` | `Page — Media Centre — In the News` |
| `media-centre-announcements` | section | `media-announcements` | `Page — Media Centre — Announcements` |
| `media-centre-events` | section | `media-events` | `Page — Media Centre — Spotlight` |

Each section's heading comes from its own headline, so renaming "In the news"
is an edit to `media-centre-news`.

### Our Ecosystem — `/about/our-ecosystem`

List: `Page — Our Ecosystem`

| Slugline | Role | Renders | Content from |
| --- | --- | --- | --- |
| `ecosystem-hero-y5vv3jai` | hero | prose | — |
| `ecosystem-groups` | section | `ecosystem-groups` | `Page — Our Ecosystem — Partners` |
| `ecosystem-roles` | section | `ecosystem-roles` | `Page — Our Ecosystem — Roles` |

### Partners — `/about/partners`

List: `Page — Partners`

| Slugline | Role | Renders | Content from |
| --- | --- | --- | --- |
| `partners-hero` | hero | prose | — |
| `partners-wall` | section | `partners-logos` | `Page — Partners — Partners` |
| `partners-allies` | section | `allies-logos` | `Page — Partners — Allies` |

The blurb above each wall is the section's **body**. The Allies list also feeds
the strip on the About page — edit it once, both change.

### Tools — `/tools`

List: `Page — Tools`

| Slugline | Role | Renders | Content from |
| --- | --- | --- | --- |
| `tools-hero` | hero | prose | — |
| `tools-showcase` | section | `tools-showcase` | `Page — Tools — Tools` |

### Privacy Policy — `/privacy-policy`

List: `Page — Privacy Policy`

| Slugline | Role | Renders | Content from |
| --- | --- | --- | --- |
| `privacy-hero` | hero | prose | — |
| `privacy-sections` | section | `legal-sections` | `Page — Privacy Policy — Sections` |

Clauses are numbered by their position in the list, so reordering renumbers the
document. The closing paragraph after the last clause is the section's **body**.

### Principles, Methodology, Funding, Knowledge

| Page | List | Sections |
| --- | --- | --- |
| Principles — `/about/principles` | `Page — Principles` | hero + 7 prose |
| Methodology — `/about/methodology` | `Page — Methodology` | hero + 12 prose |
| Funding — `/about/funding` | `Page — Funding` | hero + 3 prose |
| Knowledge — `/knowledge` | `Page — Knowledge` | hero + 3 prose |

The simplest pages: no templates, no second list. Add a section by publishing
another `Page Section` article and dropping it into the list. Once a page has
more than one prose section, the site builds its side navigation from their
headlines automatically.

## Supporting lists

These feed the templates. Each row is one article; the columns say which part
of that article becomes what on screen. Order in the list is order on the page.

| List | Headline | Summary | Body | Image | Extra fields |
| --- | --- | --- | --- | --- | --- |
| `Page — About — Team` | name | bio | — | portrait | `team_role`, `linkedin_url` |
| `Page — About — Impact` | the figure | the line beneath | — | — | `impact_icon` |
| `Page — About — Intro Images` | unused | — | — | the two portraits | — |
| `Page — FAQs — Questions` | the question | the answer | answer, if no summary | — | `faq_group` |
| `Page — Tools — Tools` | tool name | tagline | description | screenshot | `cta_url`, `cta_label` |
| `Page — Partners — Partners` | organisation | — | — | logo | — |
| `Page — Partners — Allies` | organisation | — | — | logo | — |
| `Page — Our Ecosystem — Partners` | organisation | — | — | logo | `ecosystem_group`, `partner_role`, `partner_url` |
| `Page — Our Ecosystem — Roles` | role name | — | description | — | `ecosystem_role_icon` |
| `Page — Media Centre — In Research` | the label | the copy | — | — | `media_centre_label` |
| `Page — Media Centre — In the News` | headline | — | sets read time | clipping image | `media_centre_label` |
| `Page — Media Centre — Announcements` | headline | excerpt | — | — | `media_centre_label` |
| `Page — Media Centre — Spotlight` | event name | description | — | event image | `event_venue`, `event_dates`, `event_format`, `event_languages`, `event_cost` |
| `Page — Contact Us — Locations` | country | city | person | — | `contact_email`, `contact_phone` |
| `Page — Contact Us — WhatsApp` | column heading | — | column text | — | — |
| `Page — Privacy Policy — Sections` | clause title | — | clause text | — | — |
| `Page — Imprint — Sections` | clause title | — | clause text | — | — |

Three lists carry rules that are not obvious from the table:

- **Spotlight** — the *first* event is the large featured one; the rest become
  the "Also coming up" cards. Promote an event by dragging it to the top.
- **WhatsApp** — exactly two columns. The first gets the channel link, the
  second the QR code. Reordering swaps them.
- **FAQ Questions** — groups are not configured anywhere. They appear in the
  order their first question does, so dragging a question to the top promotes
  its whole group. Questions with no `faq_group` collect in an untitled group
  at the top.

## Vocabularies

Set under **Subject**, chosen from a list. Three have values the site knows by
name — picking anything else falls back to a default rather than failing loudly.

| Vocabulary | Used on | Notes |
| --- | --- | --- |
| `page_section_role` | page sections | `hero`, `section`, `cta` |
| `page_section_template` | page sections | Fixed set — each value is a block the site knows how to draw. Adding one needs a developer. |
| `faq_group` | FAQ questions | Free to name. The group heading is the value you pick. |
| `media_centre_label` | Media Centre entries | The kind of document, the outlet name, or the announcement tag, depending on the list. |
| `ecosystem_group` | ecosystem partners | Free to name. Becomes the band heading. |
| `ecosystem_role_icon` | ecosystem roles | **Fixed:** `announce`, `hand`, `server`. |
| `impact_icon` | impact stats | **Fixed** — the same icon set the site navigation uses. |

## Custom fields

Typed in directly. They only appear on profiles that carry them, which is why a
field you expect can be missing from an article.

| Field | On | What it does |
| --- | --- | --- |
| `content_list` | page sections | Points a template at a different list than its usual one. This is how the imprint clauses appear on Contact Us. |
| `cta_url` | page sections, tools | Where the button or card goes. |
| `cta_label` | page sections, tools | The button's words. Tools default to "Visit website". |
| `team_role` | team members | Job title under the name. |
| `linkedin_url` | team members | Turns the card's badge into a link. Empty hides it. |
| `partner_role` | ecosystem partners | The pill on the card — "Verified signatory". |
| `partner_url` | ecosystem partners | Where "Learn More" goes. **Fill this in** — without it the card links to its own article, which reads as though the organisation were a fact-check. |
| `event_venue` | events | "Nairobi", "Online". Shown above the headline. |
| `event_dates` | events | Written as you want it read: "12–13 September 2026". |
| `event_format` | events | "In person & streamed". A detail row on the featured event. |
| `event_languages` | events | "English, French, Kiswahili". |
| `event_cost` | events | "Free for partner newsrooms". |
| `contact_address` | contact sections | The postal address beside the map pin. |
| `contact_email` | contact sections, offices | An office card without one is dropped. |
| `contact_phone` | contact sections, offices | Also the large WhatsApp number. |

Every event detail field is optional on its own: an unset one drops its row
rather than printing a blank.

## What silently breaks

None of these show an error. The page simply comes out wrong.

- **A tool with no link disappears.** The whole card is a link, so an entry with
  an empty `cta_url` — or no screenshot — is dropped from `/tools` rather than
  shown without a button.
- **An empty clause is dropped.** A privacy or imprint clause with a title but
  no body is skipped, and the clauses after it renumber. A numbered heading with
  nothing under it reads as though the text had been removed.
- **An office with no email is dropped.** The card's only action is the address.
- **A CTA with no URL stays a normal section.** Tagging a section `cta` is not
  enough; without `cta_url` it renders in place as ordinary prose.
- **Sluglines are permanent.** Set at first publish and used as the section's
  anchor link. Renaming means a new article, and any link pointing at the old
  anchor breaks.
- **Two heroes, or none.** Tag exactly one section `hero`. With none, the first
  item in the list is used — which changes the moment someone reorders the page.
- **A shared list changes two pages.** The Allies list feeds both the Partners
  page and the strip on About; the imprint clauses feed both the imprint and
  Contact Us. Deliberate, but worth knowing before you delete a row.
- **An empty template section vanishes.** A section whose template finds nothing
  renders as nothing at all, rather than as an empty heading. A section that has
  "disappeared" usually means its list is empty or misnamed.
- **List names must match exactly**, including the long dash. A typo in
  `content_list`, or a renamed list, produces an empty section rather than a
  warning.

## Known problems

Two things that are broken now and cannot be fixed by editing content.

**Tool and CTA links cannot be edited.** `cta_url` and `cta_label` are not
attached to any content profile, so no field is shown for them anywhere in
Superdesk. The values currently on the site were loaded through the API, which
is why the links work but cannot be changed. The fix is to add both fields to
the `Page Section` profile.

**The imprint page returns "not found".** `/imprint` has no route in Publisher,
so the page 404s even though its content is intact — `Page — Imprint` and
`Page — Imprint — Sections` are both still populated, and the footer still links
to it. Recreating a route with the slug `imprint` restores the page. The same
clauses continue to appear on Contact Us in the meantime.
