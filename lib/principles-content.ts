/**
 * Page-specific content for the About → Principles page. Copy sourced from the
 * live Ghost site (https://pesacheck.org/our-principles/) per issue #45; the
 * "Transparency of Funding" section of that page lives on the dedicated
 * Funding page (`lib/funding-content.ts`). Site-wide content (nav, footer,
 * allies/partners) lives in `lib/site.ts`.
 */
import type { ContentBlock } from "@/lib/content-blocks";

export const PRINCIPLES_HERO = {
  title: "Principles",
  subtitle:
    "PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making",
};

export type { ContentBlock } from "@/lib/content-blocks";

// Image layout beneath the copy. "small" boxes pair up in a 2-col grid;
// "large" boxes span the full reading column. Mirrors the grey rectangles in
// the design.
export type ImageSlot = "small" | "large";

export type PrinciplesSection = {
  id: string;
  title: string;
  blocks: ContentBlock[];
  learnMore: boolean;
  images: ImageSlot[];
};

export const PRINCIPLES_SECTIONS: PrinciplesSection[] = [
  {
    id: "who-we-are",
    title: "Who We Are",
    blocks: [
      {
        type: "img",
        src: "/images/principles/principles.webp",
        alt: "Our principles and funding",
        width: 4000,
        height: 2250,
      },
      {
        type: "p",
        text: "**PesaCheck** was established as an initiative of **Code for Africa (CfA)** in 2016 by Justin Arenstein and Catherine Gicheru. It was East Africa's first fact-checking initiative at the time, and has since grown into the continent's largest fact-checking network with full-time teams in 16 African countries spanning the Sahel, west, east to south Africa.",
      },
      {
        type: "p",
        text: "We believe citizens need accurate information to make informed decisions. Public finances shape citizens lives disproportionately in developing nations. We therefore verify the often confusing numbers quoted by public figures, looking into how public resources are being allocated and utilised, as well as how governments are delivering on services linked to the Sustainable Development Goals (SDGs). This focus on SDG-related topics includes dedicated fact-checking desks tracking climate and gender mis/disinformation.",
      },
      {
        type: "p",
        text: "PesaCheck also tests the accuracy of media reportage and misinformation spread on social media. We check and verify a variety of claims by public figures, individuals and media organisations across Africa. The claims we check are sourced from mainstream media, and on social media platforms like Facebook, Instagram, Telegram, TikTok, Twitter, and WhatsApp.",
      },
      {
        type: "p",
        text: "PesaCheck goes beyond just fact-check reports. We also build data-driven tools for our media partners or the public itself to verify facts in the information they receive. **[PesaYetu](https://pesayetu.pesacheck.org/)** gives users easy access to government budget and census/demographic data, in shareable infographic formats. **Wajibisha** (or **[PromiseTracker](https://promisetracker.africa/)**, in non-Kiswahili speaking countries) helps both watchdog organisations and ordinary citizens check what promises politicians or government has made. **[TaxClock](https://taxclock.pesacheck.org/)** helps taxpayers check what government is using their money for.",
      },
      {
        type: "p",
        text: "PesaCheck has in-country fact-checkers in Benin, Burkina Faso, Burundi, Cameroon, Central African Republic, Côte d'Ivoire, Democratic Republic of Congo, Ethiopia, Guinea, Kenya, Mali, Niger, Senegal, Tanzania and Uganda. PesaCheck also supports fact-checking partners elsewhere in Africa, including Ghana, Nigeria, South Africa, South Sudan, Togo, and Zimbabwe. We also work closely with CfA's forensic investigation team targeting disinformation, the **[iLAB](https://investigate.africa/reports/)**, at the **[African Network of Centres for Investigative Reporting](https://investigate.africa/)** (ANCIR), which empowers investigative newsrooms across the continent. And, we regularly collaborate with the Atlantic Council's Digital Forensic Research Lab (**[DFRLab](https://medium.com/dfrlab)**) initiative's Africa team, which is incubated by CfA.",
      },
      {
        type: "p",
        text: "All our operations are guided by principles laid out by the [International Fact-Checking Network](https://www.poynter.org/ifcn/).",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "our-mission",
    title: "Our Mission",
    blocks: [
      {
        type: "p",
        text: "PesaCheck's mission is to counter harmful misinformation, by publishing factual information that corrects or contextualises misleading claims about how public resources are being utilised.",
      },
      {
        type: "p",
        text: "We do this because misleading information and the resulting misunderstandings shape public perceptions and public policy, and ultimately distort how we organise and develop our societies.",
      },
      {
        type: "p",
        text: "PesaCheck therefore doesn't just fact-check politicians or public officials. We also proactively fact-check the media itself, pointing out when journalists or pundits fall short of the facts.",
      },
      {
        type: "p",
        text: "There is however simply too much misinformation for any one organisation to solve. That is why we seek to give citizens, and our watchdog partners, easy-to-use tools and data to fact-check claims themselves.",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "transparency-of-sources",
    title: "Transparency of Sources and Evidence",
    blocks: [
      {
        type: "p",
        text: "Transparency is central to PesaCheck's mission, and is crucial for building trust and accountability around the work we do. We therefore strive to be transparent about not just our systems, but also how we arrive at a finding on any claim we are fact-checking.",
      },
      {
        type: "p",
        text: "As such, PesaCheck's work is evidence-driven with all our research and fact-checking based on source documents or other evidence (such as data, or budgets, or multimedia recordings). We cite all the evidence we use in every fact-check, linking to the public version of the material where possible. Where there is no public version, PesaCheck uploads source documents to CfA's **[sourceAFRICA](https://sourceafrica.net/)** platform for our audience to read, annotate and share. We also upload any data we use to CfA's **[openAFRICA](https://africaopendata.org/)** platform for our audience to review, test and re-use as they wish. And, we back-up copies of videos or audio files, and webpages to **[Archive.org](https://archive.org/)** to ensure there is an abiding public record, even if the original source disappears.",
      },
      {
        type: "p",
        text: "Where we quote human sources, we always explain their affiliations and expertise relating to the topic. We ensure that we flag any possible vested interests, or conflicts of interest. And, to ensure that no single source inadvertently misconstrues or misspeaks on an issue, we strive to multi-source key clarifications on the topics we are fact-checking.",
      },
      {
        type: "p",
        text: "We also publish our step-by-step editorial workflow, along with a copy of our staff organisation chart, so that the public understands the technical process we follow to produce a fact-check, and understand our multi-person and multi-edit/verification process to ensure that all information is checked and validated by a team of editors to protect against bias by any single author or source.",
      },
      {
        type: "p",
        text: "The result is a transparent process where our audience has unfettered immediate access to the supporting evidence we cite, to make up their own minds about our research.",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "non-partisanship",
    title: "Non-Partisanship and Fairness",
    blocks: [
      {
        type: "p",
        text: "PesaCheck is an initiative of **[Code for Africa](https://codeforafrica.org/)** (CfA), which is the continent's largest open data/civic technology initiative with 103 full-time staff (as at June 2022) in 21 African countries.",
      },
      {
        type: "p",
        text: "CfA is registered as a public benefit and tax-exempt non-profit organisation in South Africa (registration number: [168–092 NPO](http://www.npo.gov.za/PublicNpo/Npo/DetailsPublicDocs/33619918)), as well as an NGO in Kenya (where it is registered as the Civic Media Foundation, with registration number CPR/2016/220101) and Nigeria (registered as the Civic Foundation Nigeria Ltd/Gte RC 1503312).",
      },
      {
        type: "p",
        text: "All CfA staff, including PesaCheck's team of 30 full-time editors/fact-checkers, are governed by the organisation's **[Charter](https://medium.com/code-for-africa/about-us-567c3fde3ad3)**, which explicitly states that CfA is non-partisan and non-aligned, and that CfA does not support or oppose any political party or candidate or cause.",
      },
      {
        type: "p",
        text: "CfA and PesaCheck's explicit mission is to instead support active and engaged citizenship, by promoting citizens' access to actionable evidence-based information that they can then use to shape public discourse, engage their leaders and hold their governments accountable.",
      },
      {
        type: "p",
        text: "Where PesaCheck has received funding, either directly or indirectly, related to a foreign government or one of its development agencies or sovereign funds, the terms of these grants include clauses that explicitly guarantee complete editorial control for PesaCheck.",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "digital-platforms",
    title: "Our Partnership with Digital Platforms",
    blocks: [
      {
        type: "p",
        text: "Misinformation is not new. It has always existed. The explosive growth of social media has, however, diluted the role of traditional gatekeepers and watchdogs such as the media by allowing ordinary citizens to become publishers in their own right. Social media is now amongst the largest sources of information for ordinary citizens in all 14 countries where PesaCheck operates. This democratisation of online information has turbocharged the spread of misleading or unsubstantiated information, and other toxic content (such as hate speech).",
      },
      {
        type: "p",
        text: "To help combat the spread of misinformation at source, PesaCheck has partnered with [Facebook since 2018](https://pesacheck.org/pesacheck-and-facebook-partner-to-fight-misinformation-in-kenya-d6a45ee70c18), and with WhatsApp since 2020. As a third party fact-checker with [Meta's Journalism Program](https://www.facebook.com/journalismproject/programs/third-party-fact-checking), PesaCheck looks into questionable claims published on the platform that touch on matters of public interest, and rates them (as false, partly false, altered, missing context and satire) using a set of transparent processes for arriving at a determination.",
      },
      {
        type: "p",
        text: "PesaCheck shares its findings with Facebook, which then decides to take action, if any, on the original posts that sparked our fact-checking. [Learn more about fact-checking on Facebook](https://web.facebook.com/business/help/1964098996981326?id=211528469955719).",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "international-standards",
    title: "Holding Ourselves to International Standards",
    blocks: [
      {
        type: "p",
        text: "PesaCheck has a number of ways for the public to lodge complaints about its fact-checks, or to ask our researchers to fact-check a dubious claim by a public figure. But, who watches the watchdog? PesaCheck is a verified signatory of the International Fact-Checking Network's (IFCN) **[Code of Principles](https://www.ifcncodeofprinciples.poynter.org/)**.",
      },
      {
        type: "p",
        text: "As such, PesaCheck undergoes an independent annual assessment, to ensure that we are genuinely editorially independent and that we adhere to accepted professional standards.",
      },
      {
        type: "p",
        text: "The IFCN code binds organisations that regularly publish nonpartisan reports on the accuracy of statements by public figures, major institutions, and other widely circulated claims of interest to society to a set of principles that include:",
      },
      {
        type: "ul",
        items: [
          "A commitment to transparency of sources",
          "A commitment to nonpartisanship and fairness",
          "A commitment to transparency of methodology",
          "A commitment to open and honest corrections",
        ],
      },
      {
        type: "p",
        text: "To ensure that the code has teeth, and that PesaCheck is accountable, IFCN offers an independent **[complaint mechanism](https://www.ifcncodeofprinciples.poynter.org/complaints-policy)** for anyone who believes that fact-checkers are violating their commitment to the principles.",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "mistakes-and-corrections",
    title: "Our Mistakes and Corrections",
    blocks: [
      {
        type: "p",
        text: "Transparency is a core value at PesaCheck. We strive for accuracy, but we all make mistakes sometimes. While every error is a weakness, some errors are inevitable, and we are fully open to correcting them promptly in whatever material we publish on our platforms.",
      },
      {
        type: "p",
        text: "When we run a correction, clarification or editor's note, our goal is to tell readers, as clearly and quickly as possible, what was wrong and what is correct. Anyone should be able to understand how and why a mistake has been corrected.",
      },
    ],
    learnMore: false,
    images: [],
  },
];
