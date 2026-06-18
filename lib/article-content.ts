/**
 * Data types and sample content for the single-article (long-form) page.
 * Transcribed from Figma node 2866:1768.
 */

import type { Story } from "@/lib/home-content";

export type Article = {
  slug: string;
  /** Full-bleed hero image (1440×640). */
  image: string;
  alt: string;
  title: string;
  verdict?: string;
  /** Chips shown on hero and end-of-article tag row. */
  tags: string[];
  date: string;
  readTime: string;
  author: string;
  /** Content desk slug for back-links and "you're reading" context. */
  desk?: string;
  /** Intro paragraphs before the inline image. */
  leadParagraphs: string[];
  inlineImage?: { src: string; alt: string };
  /** Body paragraphs after the inline image. */
  bodyParagraphs: string[];
  /** Smaller italic footnotes at the bottom of the article body. */
  footnotes: string[];
  relatedStories: Story[];
};

// ── Related stories placeholder ─────────────────────────────────────────────

const PLACEHOLDER_TITLE =
  "Subtitle - different from title in the image - 20 words Max 3 lines";

const RELATED_STORIES: Story[] = [
  {
    image: "/images/spotlight/long-format1-1.png",
    alt: "Related story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Topic",
    region: "Region",
    language: "Language",
    date: "Jul 28",
    readTime: "3 min",
    href: "/fact-checks/south-africas-manufacturing-surge",

  },
  {
    image: "/images/spotlight/long-format3-2.png",
    alt: "Related story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Topic",
    region: "Region",
    language: "Language",
    date: "Jul 28",
    readTime: "3 min",
    href: "/fact-checks/south-africas-manufacturing-surge",

  },
  {
    image: "/images/spotlight/long-format1-2.png",
    alt: "Related story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Topic",
    region: "Region",
    language: "Language",
    date: "Jul 28",
    readTime: "3 min",
    href: "/fact-checks/south-africas-manufacturing-surge",

  },
  {
    image: "/images/spotlight/long-format4-1.png",
    alt: "Related story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Topic",
    region: "Region",
    language: "Language",
    date: "Jul 28",
    readTime: "3 min",
    href: "/fact-checks/south-africas-manufacturing-surge",

  },
];

// ── Sample article ───────────────────────────────────────────────────────────

export const SAMPLE_ARTICLE: Article = {
  slug: "south-africas-manufacturing-surge",
  image: "/images/article/hero.jpg",
  alt: "South Africa manufacturing facility",
  title:
    "South Africa's Manufacturing Surge: Revitalized Industries Empower Local Communities and Global Markets",
  verdict: "Partly False",
  tags: ["Tag/Topic1", "Tag/Topic 2"],
  date: "Jul 28",
  readTime: "3 min",
  author: "Michael Karanja",
  desk: "climate-change",
  leadParagraphs: [
    "South Africa is experiencing a manufacturing resurgence that is invigorating local communities and strengthening its position in global markets.",
    "Through strategic investments in technology, innovation, and workforce development, the nation is revitalizing its industrial base, creating jobs, and enhancing export opportunities in an increasingly competitive global economy.",
    "At the forefront of this transformation is the \u201cMade in Africa\u201d initiative, a collaborative effort between government agencies, industry leaders, and educational institutions designed to modernize manufacturing processes and promote sustainable growth. \u201cOur vision is to empower South African industries to compete on a global stage while ensuring that our citizens benefit from the growth we create,\u201d stated Minister of Trade and Industry Thabo Nkosi at a recent summit in Johannesburg.",
    "The initiative is modernizing traditional manufacturing sectors by integrating advanced technologies such as automation, robotics, and real-time data analytics. These innovations are driving significant improvements in productivity, product quality, and operational efficiency. Local manufacturers are now able to reduce waste, lower production costs, and offer competitive prices to international buyers. \u201cTechnology is our pathway to revitalizing manufacturing and expanding our global footprint,\u201d commented a senior industry executive.",
  ],
  inlineImage: {
    src: "/images/spotlight/long-format3-2.png",
    alt: "Manufacturing workers in South Africa",
  },
  bodyParagraphs: [
    "The benefits of the manufacturing surge extend deeply into local communities. With a renewed focus on domestic production, job opportunities are on the rise, particularly in regions that had long struggled with industrial decline. Vocational training programs and partnerships with technical colleges are equipping workers with the skills needed to excel in modern manufacturing environments. \u201cThis initiative is not just about building products—it’s about building futures and uplifting communities,\u201d noted a community leader from the Eastern Cape.",
    "In addition, South African manufacturers are tapping into new export markets, capitalizing on the global demand for high-quality, ethically produced goods. The Made in Africa initiative is opening doors to trade partnerships in Europe, Asia, and the Americas, thereby enhancing the country’s export portfolio and driving economic growth. \u201cOur products tell a story of innovation, resilience, and quality,\u201d said a representative from the South African Chamber of Commerce.",
    "Government support has been a critical component of this manufacturing revival. Tax incentives, infrastructure investments, and streamlined regulatory processes have created a business-friendly environment that encourages local and foreign investment. These policies are not only boosting industrial output but are also establishing South Africa as a competitive hub for global manufacturing.",
    "As South Africa’s manufacturing sector surges forward, the positive impact on citizens and international trade becomes increasingly evident. The Made in Africa initiative is a testament to the power of innovation, collaboration, and strategic policy-making—a model for how nations can revitalize traditional industries, empower local communities, and succeed in a global economy. With its renewed focus on manufacturing excellence, South Africa is paving the way for a future of sustained economic growth and shared prosperity.",
  ],
  footnotes: [
    "This post is part of an ongoing series of PesaCheck fact-checks examining content marked as potential misinformation on Facebook and other social media platforms. By partnering with Facebook and similar social media platforms, third-party fact-checking organisations like PesaCheck are helping to sort fact from fiction. We do this by giving the public deeper insight and context to posts they see in their social media feeds. Have you spotted what you think is fake news or false information on Facebook? Here's how you can report. And, here's more information on PesaCheck's methodology for fact-checking questionable content.",
    "This fact-check was written by a PesaCheck fact-checker based in Ethiopia (name withheld for security reasons) and edited by PesaCheck senior copy editor Mary Mutisya. The article was approved for publication by PesaCheck chief copy editor Stephen Ndegwa.",
    "PesaCheck is East Africa's first public finance fact-checking initiative. It was co-founded by Catherine Gicheru and Justin Arenstein, and is being incubated by the continent's largest civic technology and data journalism accelerator: Code for Africa. It seeks to help the public separate fact from fiction in public pronouncements about the numbers that shape our world, with a special emphasis on pronouncements about public finances that shape government's delivery of Sustainable Development Goals (SDG) public services, such as healthcare, rural development and access to water / sanitation. PesaCheck also tests the accuracy of media reportage. To find out more about the project, visit pesacheck.org. PesaCheck is an initiative of Code for Africa, through its innovateAFRICA fund, with support from Deutsche Welle Akademie, in partnership with a coalition of local African media and other civic watchdog organisations.",
  ],
  relatedStories: RELATED_STORIES,
};

// ── Article registry ─────────────────────────────────────────────────────────

export const ARTICLES: Record<string, Article> = {
  [SAMPLE_ARTICLE.slug]: SAMPLE_ARTICLE,
};

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES[slug];
}
