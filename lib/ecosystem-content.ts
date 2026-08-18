/**
 * Page-specific content for the About → Our Ecosystem page, transcribed
 * from the design export (`pages/EcosystemPage.jsx`). Site-wide content
 * (nav, footer, allies/partners) lives in `lib/site.ts`.
 */

export const ECOSYSTEM_HERO = {
  title: "Our Ecosystem",
  subtitle: "Learn more about PesaCheck's Affiliations & network partnerships",
};

export type EcosystemTone = "blue" | "green" | "ink" | "red";

export type EcosystemLogo = {
  src: string;
  width: number;
  height: number;
};

export type EcosystemItem = {
  name: string;
  role: string;
  tone: EcosystemTone;
  logo: EcosystemLogo;
  description: string;
  href: string;
};

export type EcosystemGroup = {
  title: string;
  items: EcosystemItem[];
};

const CFA_LOGO: EcosystemLogo = {
  src: "/images/our-ecosystem/code-for-africa.png",
  width: 145,
  height: 64,
};

const ANCIR_LOGO: EcosystemLogo = {
  src: "/images/our-ecosystem/ancir-ilab.png",
  width: 284,
  height: 80,
};

export const ECOSYSTEM_INTRO =
  "PesaCheck does more than publish fact-checks. We help build the infrastructure that African fact-checking depends on — convening networks, training newsrooms, and sharing tooling and data with peers across the continent. These are the alliances and networks we belong to.";

export const ECOSYSTEM_GROUPS: EcosystemGroup[] = [
  {
    title: "Fact-checking networks",
    items: [
      {
        name: "IFCN",
        role: "Verified signatory",
        tone: "blue",
        logo: CFA_LOGO,
        description:
          "PesaCheck is a verified signatory of the International Fact-Checking Network's Code of Principles, and is reassessed annually against its standards for non-partisanship, transparency of sources and funding, and open corrections.",
        href: "https://codeforafrica.org",
      },
      {
        name: "Africa Facts",
        role: "Network member",
        tone: "green",
        logo: CFA_LOGO,
        description:
          "PesaCheck takes part in the Africa Facts network of fact-checking organisations, sharing verification methods and coordinating with peers on claims that cross borders.",
        href: "https://codeforafrica.org",
      },
      {
        name: "AFCA",
        role: "Alliance member",
        tone: "ink",
        logo: CFA_LOGO,
        description:
          "PesaCheck works alongside AFCA members to counter mis- and disinformation across the continent's language and border lines.",
        href: "https://codeforafrica.org",
      },
    ],
  },
  {
    title: "Research & investigation",
    items: [
      {
        name: "ARIA",
        role: "Alliance member",
        tone: "red",
        logo: CFA_LOGO,
        description:
          "PesaCheck collaborates with ARIA partners — researchers, newsrooms and civic technologists — on cross-border responses to coordinated disinformation.",
        href: "/fact-checks",
      },
      {
        name: "ANCIR",
        role: "Sister initiative",
        tone: "blue",
        logo: ANCIR_LOGO,
        description:
          "The African Network of Centres for Investigative Reporting, whose iLAB forensics team supports PesaCheck investigations with data, OSINT and network analysis.",
        href: "/fact-checks",
      },
      {
        name: "Code for Africa",
        role: "Parent network",
        tone: "ink",
        logo: CFA_LOGO,
        description:
          "PesaCheck is an initiative of Code for Africa, the continent's largest network of civic technology and data journalism labs, operating in more than 20 countries.",
        href: "/fact-checks",
      },
    ],
  },
];

export const ECOSYSTEM_ROLES: {
  icon: "announce" | "hand" | "server";
  title: string;
  description: string;
}[] = [
  {
    icon: "announce",
    title: "We convene",
    description:
      "We bring fact-checkers together across borders and languages — coordinating on claims that travel, and agreeing shared standards for how they are checked.",
  },
  {
    icon: "hand",
    title: "We train",
    description:
      "We help watchdog media, NGOs and universities establish their own standalone fact-check desks, and train a new generation of civic watchdogs.",
  },
  {
    icon: "server",
    title: "We build tools",
    description:
      "Our open toolkits — from PromiseTracker to DebunkBot — are built for the whole ecosystem to use, not just our own newsroom.",
  },
];
