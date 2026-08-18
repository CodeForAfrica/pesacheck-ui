/**
 * Page content for the Media Centre, transcribed from the design. Copy is
 * placeholder until the newsroom supplies the real citations, clippings and
 * announcements; the shapes below are what the sections render.
 */

export const MEDIA_CENTRE_HERO = {
  title: "Media Centre",
  subtitle:
    "Where PesaCheck is cited in research and reporting, plus announcements and events from the network",
};

/** Accent used by the label bar and label text of a research strand. */
export type ResearchTone = "blue" | "navy" | "green" | "red";

export type ResearchStrand = {
  label: string;
  /** Pill on the right of the label — the kind of document being cited. */
  kind: string;
  body: string;
  tone: ResearchTone;
  href: string;
};

export const RESEARCH_CTA = "Request citation list";

export const RESEARCH_STRANDS: ResearchStrand[] = [
  {
    label: "Peer-reviewed journals",
    kind: "Journal article",
    body: "PesaCheck fact-checks and datasets are cited in peer-reviewed studies of misinformation, media trust and electoral integrity in African contexts.",
    tone: "blue",
    href: "/about/contact-us",
  },
  {
    label: "University centres",
    kind: "Working paper",
    body: "Media and communication departments across the continent draw on our verification archive as a primary source for teaching and published research.",
    tone: "navy",
    href: "/about/contact-us",
  },
  {
    label: "Conference proceedings",
    kind: "Conference paper",
    body: "Our methodology and rating scale are referenced in papers presented at fact-checking and computational journalism conferences.",
    tone: "green",
    href: "/about/contact-us",
  },
  {
    label: "Multilateral bodies",
    kind: "Policy report",
    body: "Intergovernmental and development institutions cite PesaCheck findings in reports on information integrity and public accountability.",
    tone: "red",
    href: "/about/contact-us",
  },
  {
    label: "Election observation",
    kind: "Observation report",
    body: "Election monitors reference our verification of campaign claims and viral content when documenting information conditions around African polls.",
    tone: "blue",
    href: "/about/contact-us",
  },
  {
    label: "Regulatory submissions",
    kind: "Consultation",
    body: "Our evidence is submitted to and quoted in consultations on platform accountability, media regulation and public-interest journalism.",
    tone: "navy",
    href: "/about/contact-us",
  },
];

export type NewsItem = {
  image: string;
  alt: string;
  /** Where the coverage ran — sits above the headline. */
  outlet: string;
  title: string;
  date: string;
  readTime: string;
  href: string;
};

export const NEWS: NewsItem[] = [
  {
    image: "/images/hero-preview-cards/story1.png",
    alt: "",
    outlet: "International newsrooms",
    title: "Global newsrooms credit PesaCheck on cross-border debunks",
    date: "Jul 24",
    readTime: "4 min",
    href: "#",
  },
  {
    image: "/images/latest-stories/story2.png",
    alt: "",
    outlet: "Platform reporting",
    title:
      "Third-party reporting on how fact-checking operates across African markets",
    date: "Jul 11",
    readTime: "5 min",
    href: "#",
  },
  {
    image: "/images/latest-stories/story3.png",
    alt: "",
    outlet: "Sector review",
    title:
      "Annual reviews of the field cite the scale of African verification networks",
    date: "Jun 28",
    readTime: "6 min",
    href: "#",
  },
  {
    image: "/images/latest-stories/story4.png",
    alt: "",
    outlet: "Broadcast",
    title:
      "Our editors on air explaining how a viral claim was traced to its source",
    date: "Jun 09",
    readTime: "3 min",
    href: "#",
  },
];

export type Announcement = {
  date: string;
  tag: string;
  title: string;
  excerpt: string;
  href: string;
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    date: "15 Jul 2026",
    tag: "Network",
    title: "PesaCheck opens applications for the 2026 fellowship cohort",
    excerpt:
      "Twelve places for journalists working in Amharic, Somali and Arabic-language newsrooms.",
    href: "#",
  },
  {
    date: "02 Jul 2026",
    tag: "Methodology",
    title: "Updated rating scale and correction policy published",
    excerpt:
      "The revised scale takes effect across all desks, with worked examples for each verdict.",
    href: "#",
  },
  {
    date: "18 Jun 2026",
    tag: "Partnership",
    title: "New verification desk launches with partners in the Horn of Africa",
    excerpt:
      "The desk adds daily monitoring in two additional languages and a shared tip line.",
    href: "#",
  },
  {
    date: "30 May 2026",
    tag: "Data",
    title: "Fact-check archive now available as a downloadable dataset",
    excerpt:
      "Researchers can request the full corpus with verdicts, dates, regions and source links.",
    href: "#",
  },
];

export type SpotlightEvent = {
  image: string;
  alt: string;
  /** Place and dates, e.g. "Nairobi · 12–13 September 2026". */
  meta: string;
  title: string;
  body: string;
  details: { label: string; value: string }[];
};

export const EVENT: SpotlightEvent = {
  image: "/images/hero-preview-cards/story-large.png",
  alt: "",
  meta: "Nairobi · 12–13 September 2026",
  title: "Africa Fact-Checking Summit",
  body: "Two days with editors from every PesaCheck desk on verifying public finance claims, working across six publishing languages, and building tip lines that citizens actually use. Sessions are open to partner newsrooms, researchers and funders.",
  details: [
    { label: "Format", value: "In person & streamed" },
    { label: "Languages", value: "English, French, Kiswahili" },
    { label: "Cost", value: "Free for partner newsrooms" },
  ],
};
