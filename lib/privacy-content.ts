/**
 * Page-specific content for the Privacy Policy page (issue #61). Copy is Code
 * for Africa's data-protection policy, transcribed from the approved design.
 * Body copy reuses the shared `ContentBlock` model (paragraphs / lists, with
 * `**bold**` and `[label](href)` markup via `RichText`); the page renders it in
 * the design's single-column legal layout (see `PrivacyBody`). Site-wide
 * content (nav, footer) lives in `lib/site.ts`.
 */
import type { ContentBlock } from "@/lib/content-blocks";

export type PrivacySection = {
  id: string;
  title: string;
  blocks: ContentBlock[];
};

export const PRIVACY_HERO = {
  title: "Privacy Policy",
  subtitle: "Learn about PesaCheck's Privacy Policy",
};

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "definitions",
    title: "Definitions",
    blocks: [
      {
        type: "ul",
        items: [
          "**ADPPA:** American Data Privacy and Protection Act.",
          "**CfA:** Code for Africa.",
          "**Data Controller:** The natural or legal person who (either alone or jointly or in common with other persons) determines the purposes for which and the manner in which any personal information are, or are to be, processed.",
          "**Data Processor:** Any natural or legal person who processes the data on behalf of the Data Controller.",
          "**Data Subject:** Any living individual who is using our Service(s) and is the subject of Personal Data.",
          "**GDPA:** General Data Protection Regulation Act.",
          "**POPIA:** South African Protection of Personal Information Act.",
        ],
      },
    ],
  },
  {
    id: "principles-for-processing",
    title: "Principles for processing personal data",
    blocks: [
      { type: "p", text: "Our principles for processing personal data are:" },
      {
        type: "ul",
        items: [
          "**Fairness and lawfulness:** When we process personal data, the individual rights of the Data Subjects must be protected. All personal data must be collected and processed in a legal and fair manner.",
          "**Restricted to a specific purpose:** The personal data of the Data Subject must be processed only for specific purposes.",
          "**Transparency:** The Data Subject must be informed of how his/her data is being collected, processed and used.",
        ],
      },
    ],
  },
  {
    id: "what-data-we-collect",
    title: "What data do we collect?",
    blocks: [
      { type: "p", text: "CfA collects the following data:" },
      {
        type: "ul",
        items: [
          "Web analytics (using data collected by cookies on our websites, along with tools such as Google Analytics).",
          "Personal identification information, should you supply it (name, email address, phone number, etc.).",
        ],
      },
    ],
  },
  {
    id: "how-we-collect-your-data",
    title: "How do we collect your data?",
    blocks: [
      {
        type: "p",
        text: "You directly provide CfA with most of the data we collect. We collect and process data when you:",
      },
      {
        type: "ul",
        items: [
          "Register online or subscribe for any of our products, services, communities, events or newsletters.",
          "Voluntarily complete a partner/participant survey.",
          "Provide feedback on any of our message boards or via email.",
          "Use or view our website.",
        ],
      },
      {
        type: "p",
        text: "CfA may also receive your data indirectly from research tools that our editorial and journalism teams use for analysing mis-/disinformation on social media platforms.",
      },
    ],
  },
  {
    id: "how-we-use-your-data",
    title: "How will we use your data?",
    blocks: [
      {
        type: "p",
        text: "CfA uses the collected personal data for various purposes:",
      },
      {
        type: "ul",
        items: [
          "To provide you with services.",
          "To notify you about changes to our services and/or products.",
          "To provide customer support.",
          "To gather analysis or valuable information so that we can improve our services.",
          "To detect, prevent and address technical issues.",
        ],
      },
    ],
  },
  {
    id: "legal-basis",
    title: "Legal basis for collecting and processing personal data",
    blocks: [
      {
        type: "p",
        text: "CfA's legal basis for collecting and using the personal data described in this policy depends on the personal data we collect and the specific context in which we collect the information:",
      },
      {
        type: "ul",
        items: [
          "You have given CfA permission to collect your data.",
          "Processing your personal data is in CfA's legitimate interests.",
          "CfA needs to comply with the relevant laws and legislation.",
        ],
      },
    ],
  },
  {
    id: "retention",
    title: "Retention of your personal data",
    blocks: [
      {
        type: "ul",
        items: [
          "CfA will retain your personal information only for as long as is necessary for the purposes set out in this policy.",
          "CfA will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.",
        ],
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    blocks: [
      {
        type: "p",
        text: "CfA may send you information and/or alerts about initiatives or services by our digital democracy programmes that we think you might like, as well as those of our partner organisations, including from:",
      },
      {
        type: "ul",
        items: [
          "CfA's Academy for digital citizen engagement",
          "africanDRONE",
          "ANCIR and its iLAB",
          "PesaCheck",
          "sensors.AFRICA",
        ],
      },
      {
        type: "p",
        text: "If you have agreed to receive marketing, including alerts and newsletters, you may always opt out at a later date. You have the right at any time to stop CfA from contacting you for marketing purposes or giving your data to other members of the CfA network. If you no longer wish to be contacted for marketing purposes, please email us at [hello@codeforafrica.org](mailto:hello@codeforafrica.org).",
      },
    ],
  },
  {
    id: "data-protection-rights",
    title: "What are your data protection rights?",
    blocks: [
      {
        type: "p",
        text: "Data privacy laws differ depending on your country of residence, so it is impossible to detail each under this policy. It has, however, taken into consideration acts from the European Economic Area (EEA), the United States of America and South Africa. Regardless of your location, you have the following data protection rights:",
      },
      {
        type: "ul",
        items: [
          "**The right to access:** You have the right to request CfA for copies of your personal data.",
          "**The right to rectification:** You have the right to request that CfA correct any information you believe is inaccurate, and to request that CfA complete information you believe is incomplete.",
          "**The right to erasure:** You have the right to request that CfA erase your personal data, under certain conditions.",
          "**The right to restrict processing:** You have the right to request that CfA restrict the processing of your personal data, under certain conditions.",
          "**The right to object to processing:** You have the right to object to CfA's processing of your personal data, under certain conditions.",
          "**The right to data portability:** You have the right to request that CfA transfer the data that we have collected to another organisation, or directly to you, under certain conditions.",
        ],
      },
    ],
  },
  {
    id: "what-are-cookies",
    title: "What are cookies?",
    blocks: [
      {
        type: "p",
        text: "Cookies are text files placed on your computer to collect standard internet log information and visitor behaviour information. When you visit our websites, we may collect information from you automatically through cookies or similar technology. For further information, visit [allaboutcookies.org](https://allaboutcookies.org).",
      },
    ],
  },
  {
    id: "how-we-use-cookies",
    title: "How do we use cookies?",
    blocks: [
      {
        type: "p",
        text: "CfA uses cookies in a range of ways to improve your experience on our website, including:",
      },
      {
        type: "ul",
        items: [
          "Keeping you signed in.",
          "Understanding how you use our websites.",
        ],
      },
    ],
  },
  {
    id: "types-of-cookies",
    title: "What types of cookies do we use?",
    blocks: [
      {
        type: "p",
        text: "There are a number of different types of cookies; our website uses:",
      },
      {
        type: "ul",
        items: [
          "**Functionality:** CfA uses cookies so that we recognise you on our website and remember your previously selected preferences. These could include what language you prefer and the location you are in. A mix of first-party and third-party cookies is used.",
          "**Advertising:** CfA uses cookies to collect information about your visit to our website, the content you viewed, the links you followed and information about your browser, device and IP address. CfA sometimes shares some limited aspects of this data with third parties for advertising purposes.",
        ],
      },
    ],
  },
  {
    id: "how-to-manage-cookies",
    title: "How to manage cookies",
    blocks: [
      {
        type: "p",
        text: "You can set your browser not to accept cookies, and [allaboutcookies.org](https://allaboutcookies.org) tells you how to remove cookies from your browser. However, in a few cases, some of our website features may not function as a result.",
      },
    ],
  },
  {
    id: "how-to-contact-us",
    title: "How to contact us",
    blocks: [
      {
        type: "p",
        text: "If you have any questions about CfA's privacy policy, the data we hold on you, or you would like to exercise one of your data protection rights, please do not hesitate to contact us. Email us at: [hello@codeforafrica.org](mailto:hello@codeforafrica.org).",
      },
    ],
  },
];

// Standalone "about CfA" note shown after the numbered sections (smaller,
// secondary copy — mirrors the design's `.pp-about` block).
export const PRIVACY_ABOUT =
  "Code for Africa ('CfA') is a public benefit non-profit organisation that uses open (public) data and civic technologies to support digital democracy initiatives across the continent. CfA is headquartered in South Africa (where it is registered as a tax exempt non-government organisation with registration number 168-092-NPO), operating from offices at Workshop 17, Watershed, 17 Dock Road, V&A Waterfront, Cape Town, South Africa, 8002. CfA is also separately registered as a public benefit non-profit in Kenya (number CPR/2016/220101) and Nigeria (number RC 1503312). CfA incubates a range of initiatives, including the africanDRONE network of civic drone operators, the African Network of Centres for Investigative Reporting (ANCIR), the PesaCheck network of fact-checking mis-/disinformation researchers, and the sensors.AFRICA network of citizen science and remote sensing activists. It also supports a range of other third party initiatives, through its innovateAFRICA.fund.";
