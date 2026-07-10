/**
 * Page-specific content for the About → Methodology page. Copy sourced from the
 * live Ghost site (https://pesacheck.org/our-methodology/) per issue #45.
 * Site-wide content (nav, footer, allies/partners) lives in `lib/site.ts`.
 */
import type { ContentBlock } from "@/lib/content-blocks";

export const METHODOLOGY_HERO = {
  title: "How PesaCheck Works",
  subtitle:
    "PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making",
};

export type { ContentBlock } from "@/lib/content-blocks";

// Image layout beneath the copy. "small" boxes pair up in a 2-col grid;
// "large" boxes span the full reading column. Mirrors the grey rectangles in
// the design.
export type ImageSlot = "small" | "large";

export type MethodologySection = {
  id: string;
  title: string;
  blocks: ContentBlock[];
  learnMore: boolean;
  images: ImageSlot[];
};

export const METHODOLOGY_SECTIONS: MethodologySection[] = [
  {
    id: "who-we-are",
    title: "Who We Are",
    blocks: [
      {
        type: "img",
        src: "/images/methodology/methodology.webp",
        alt: "How PesaCheck works",
        width: 1400,
        height: 788,
      },
      {
        type: "p",
        text: "**PesaCheck** was East Africa's first fact-checking initiative when it was co-founded by Justin Arenstein and Catherine Gicheru as part of their joint ICFJ Knight Fellowships in 2016 (covering Kenya, Tanzania and Uganda), and was the continent's first to focus on public finances and government statistics that are often used to confuse or mislead the public. The initiative grew quickly, both geographically and to cover additional topics. It is today Africa's largest indigenous fact-checking organisation with full-time researchers in 18 African countries, spanning the Sahel and Horn of Africa, as well as the Congo Basin region.",
      },
      {
        type: "p",
        text: "Uniquely, PesaCheck fact-checks from the frontlines in countries undergoing civil war, extremist insurgencies, or ruled by military junta.",
      },
      {
        type: "p",
        text: "**PesaCheck** is an initiative of **Code for Africa** (CfA), which is the continent's largest network of civic technology and digital democracy labs in 26 countries. PesaCheck forms part of CfA's portfolio of information integrity projects that includes a series of seed grants to the continent's first dedicated fact-checking organisation, **[Africa Check](https://africacheck.org/)** starting in 2012, and the **[African Network of Centres for Investigative Reporting](https://investigate.africa/)**'s (ANCIR) iLAB for forensic data-driven network analysis of the influence operations behind disinformation. CfA has also made extended grants and technical support to **[africanDRONE](https://africandrone.org/)** and **[African Defence Review](https://www.africandefence.net/)** (ADR) for the use of satellite and drone imagery for fact-checking in conflict zones, and to a series of fact-checking start-ups everywhere from Cameroon and Kenya, to Somalia and South Sudan.",
      },
      {
        type: "p",
        text: "In addition to the grants and technical support to individual fact-checking teams, CfA is the custodian of the **[African Fact-Checking Alliance](https://factcheck.africa/)** (AFCA), founded in 2021, with 349 partner newsrooms in 27 African countries, which trains journalists in fact-checking and helps media collaborate on joint projects to debunk harmful mis/disinformation campaigns across the continent. AFCA often works closely with another CfA initiative: the **[African Digital Democracy Observatory](https://disinfo.africa/)** (ADDO), which networks academic researchers and policy think tanks that tackle information disorder issues, ranging from malign state-affiliated influence campaigns to disinformation conspiracist networks.",
      },
      {
        type: "img",
        src: "/images/methodology/afca.png",
        alt: "African Fact-Checking Alliance",
        width: 1400,
        height: 560,
      },
      {
        type: "p",
        text: "CfA is registered as a public benefit tax exempt non-profit organisation in South Africa, registration number NPO 168–092, with non-profit subsidiaries in Kenya with registration number CPR/2016/220101 and in Nigeria with registration RC 1503312.",
      },
      {
        type: "p",
        text: "PesaCheck believes citizens need accurate information to make informed decisions. Public finances shape citizens lives disproportionately in developing nations. We therefore verify the often confusing numbers quoted by public figures, looking into how public resources are being allocated and utilized, as well as how governments are delivering on services linked to the Sustainable Development Goals (SDGs). This focus on SDG-related topics includes dedicated fact-checking desks tracking climate and gender mis/disinformation.",
      },
      {
        type: "p",
        text: "As illustrated in the five-step editorial process below, PesaCheck only fact-checks statements which are based on verifiable facts or numbers. There are things we cannot check, for example, opinions, and statements about the future.",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "structure-and-process",
    title: "Our Structure and Process",
    blocks: [
      {
        type: "p",
        text: "PesaCheck is structured as a journalistic newsroom, with a clear step-by-step workflow system that uses editorial checklists and production guidelines to create a transparent process for identifying eligible claims for our teams to fact-check, and a standardised methodology for researching and reporting our findings.",
      },
      {
        type: "img",
        src: "/images/methodology/fact-checking-process.jpeg",
        alt: "PesaCheck's five-step fact-checking process: identify claim, find data, authenticate data, verify claim, publish findings",
        width: 1400,
        height: 728,
      },
      {
        type: "p",
        text: "The process ensures that each fact-check is reviewed and validated by multiple editors, to prevent personal bias/agendas. The structure (and accompanying role descriptions) also clearly outline the roles, responsibilities and mandate for each team member.",
      },
      {
        type: "img",
        src: "/images/methodology/editorial-workflow.jpeg",
        alt: "PesaCheck's editorial workflow diagram",
        width: 1400,
        height: 263,
        caption: "A snapshot of PesaCheck's editorial workflow process",
      },
      {
        type: "p",
        text: "PesaCheck is headed by a **publisher**, who is also CfA's chief operating officer. The publisher drives organisational strategy and partnerships. PesaCheck's editorial strategy and direction is set by PesaCheck's **editor-in-chief**, who is also CfA's chief executive officer. PesaCheck's newsroom is led by its **managing editor**, who is the senior editorial decision-maker and is responsible for shaping day-to-day editorial priorities and signing off all fact-checks before publication. The managing editor is assisted by three deputy editors: a **news editor** who manages the NewsDesk and in-country researchers/fact-checkers across the continent; a **chief copy editor** who manages the multilingual CopyDesk that uses a three-step process to check all fact-checks for factual accuracy and grammatical correctness; and a **special projects editor** who oversees PesaCheck's digital innovations including our DebunkBot, PromiseTracker, PesaYetu and TaxClock toolkits.",
      },
      {
        type: "p",
        text: "PesaCheck currently publishes in two international languages, English and French, as well as a number of indigenous 'regional' African languages, such as Afaan-Oromo, Amharic and Kiswahili. The editors are therefore supported by deputies who serve as regional team coordinators, as well as newsdesk-based specialist data analysts/researchers.",
      },
      {
        type: "p",
        text: "The PesaCheck newsdesk receives additional support from CfA's wider data journalism and infographic design teams, as well as its digital engagement (social media and multimedia) team. PesaCheck works closely with CfA's Academy to help mentor and train other newsrooms or civic watchdogs.",
      },
      {
        type: "img",
        src: "/images/methodology/newsroom-roles.png",
        alt: "Organisation chart of PesaCheck's newsroom roles",
        width: 1400,
        height: 744,
        caption: "An overview of the roles in PesaCheck's newsroom",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "our-researchers",
    title: "Our Researchers",
    blocks: [
      {
        type: "p",
        text: "PesaCheck's editorial team is composed of fact-checkers who have extensive journalistic experience, or who are research specialists in topics such as economics, public finances or development issues.",
      },
      {
        type: "p",
        text: "Our fact-checkers are always locally based, in the 13 countries we report from, in Burkina Faso, Burundi, Cameroon, Central African Republic, Côte d'Ivoire, Ethiopia, Guinea, Kenya, Mali, Niger, Senegal, Tanzania and Uganda. The managing editor and chief copy editor are based in Kenya, while the special projects editor and other Francophone support staff are based in Senegal.",
      },
      {
        type: "img",
        src: "/images/methodology/coverage-map.jpeg",
        alt: "Map of Africa showing PesaCheck CopyDesk hubs, countries with PesaCheck staff or offices, and countries with CfA staff or labs",
        width: 833,
        height: 687,
      },
      {
        type: "p",
        text: "The fact-checkers regularly collaborate on regional verification projects, tackling cross-cutting thematic issues such as climate denialism and the COVID-19 health emergency, or assisting each other as part of 'rapid response teams' during civil wars/conflicts/coups in countries such as the Central African Republic, Ethiopia and Mali, as well as during the run-up/polling to fiercely contested elections.",
      },
      {
        type: "p",
        text: "PesaCheck occasionally appoints additional specialists, as short-term 'fellows' or associates, to drive specific projects such as our research into persistent conspiracy theories on YouTube or the spread of toxic speech (such as racist incitement and other hate speech) on WhatsApp.",
      },
      {
        type: "p",
        text: "PesaCheck's fact-checkers focus on verifying the accuracy and meaning of the actual content in mis-/disinformation claims. The **[iLAB](https://investigate.africa/ilab-reports/)** at ANCIR uses data science and forensic investigation to probe the 'hidden hand' networks and digital techniques used to make misleading content go viral. PesaCheck often collaborates with the iLAB and another CfA partner, the **[Digital Forensic Labs](https://medium.com/dfrlab)**' (DFRLab) Africa team, to expose large-scale coordinated inauthentic behaviour (CiB) and influence operations.",
      },
      {
        type: "p",
        text: "More information on the core PesaCheck team can be found [on our About page](/about).",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "our-sources",
    title: "Our Sources",
    blocks: [
      {
        type: "p",
        text: "There is a **lot** of mis-/disinformation and other misleading content out there. This includes claims by public figures and pundits at public events and in the mainstream media (in print media, or on TV and radio, and on their online outlets), as well as on government or political party websites, on social media (including on chat platforms such as WhatsApp) or blogging and multimedia sites such as YouTube.",
      },
      {
        type: "p",
        text: "We use a number of 'social listening' and content analysis tools, such as [Crowdtangle](https://www.crowdtangle.com/), [Meltwater](https://www.meltwater.com/en) and [Primer.ai](https://primer.ai/), as well as specialist tools shared by the social media platforms themselves, to understand what misleading content is going viral or is having measurable harmful impacts. We also collect requests from the public on claims that need checking using our dedicated [WhatsApp](https://wa.me/254780542626) tip-line and [this online form](https://docs.google.com/forms/d/e/1FAIpQLSeI9xshwBWxwDuLwT4jhR9hdRLUNkwdjo0sqEqV9N5r5lCQYQ/viewform).",
      },
      {
        type: "p",
        text: "PesaCheck believes it is important to apply a consistent set of criteria for determining eligibility for us to fact-check public claims, so that we can be consistently even-handed in our approach. We therefore use a set of checklists to guide our editors in selecting/prioritising claims to be fact-checked.",
      },
      {
        type: "p",
        text: "As a requirement for all our fact-checks, we include multiple sources of information and references. This helps to underline the veracity of our arguments. In addition, the sources are referenced accurately. To do this, we use [sourceAFRICA](https://sourceafrica.net/), a repository of actionable documents. Through sourceAFRICA, the PesaCheck team can:",
      },
      {
        type: "ul",
        items: [
          "**Archive** the source documents for future reference",
          "**Annotate** the specific page where the information is sourced from, giving readers an opportunity to review the document in its entirety",
        ],
      },
      {
        type: "p",
        text: "Every source document that is referenced in a story is saved on [sourceAFRICA](https://sourceafrica.net/) in order to preserve a copy and link directly to the information being referenced.",
      },
      {
        type: "p",
        text: "All sources and facts to be checked will be recorded on [Check](http://checkmedia.org/), where fact-check requests crowdsourced from the public and from social media will be managed and updated as they progress.",
      },
      {
        type: "p",
        text: "Where claims meet our eligibility criteria, PesaCheck prioritises claims/issues referred to us by members of the public because such requests indicate that the issue is of great public importance, and it is a good source of information that may not yet be in the public eye.",
      },
      {
        type: "p",
        text: "To ensure the credibility of PesaCheck stories, we ensure that our sources are quoted comprehensively, using their full name and designation. Any information from sources that seek anonymity is treated as background information only. Such information must be corroborated by verifiable evidence.",
      },
      {
        type: "p",
        text: "PesaCheck is committed to disclosing to its readers the sources of the information in its stories to the maximum possible extent. We want to make our reporting as transparent to the readers as possible so they may know how and where we got our information. Transparency is honest and fair, two values we cherish.",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "identifying-claims",
    title: "Identifying Claims to Check",
    blocks: [
      {
        type: "p",
        text: "Not all statements are created equal. Here are some criteria that we use to help establish a hierarchy of important statements to fact-check:",
      },
      {
        type: "ul",
        items: [
          "Amounts that can be checked and verified. Example: [Cabinet Secretary Phyllis Kandie promises Ksh18bn for orphans, disabled kids](https://pesacheck.org/cabinet-secretary-phyllis-kandie-promises-sh18bn-for-orphans-disabled-kids-7b953b5f4550)",
          "Statements that are causing the most buzz. Example: [Who really controls Ward Development Funds?](https://pesacheck.org/governors-or-elected-county-assembly-members-who-really-controls-the-money-8238fad5ca4c)",
          "Statements that have gone viral on social media or are being repeated often by public officials. Example: [Will Kenya Olympic champs get Sh1bn bonus](https://pesacheck.org/will-kenyas-olympic-champs-get-a-ksh1-billion-bonus-216c42809da7)",
          "Statements that can be proved or are well supported by facts — is the statement a prediction, or subjective? Example: [Is Kenya increasing funding to the health sector?](https://pesacheck.org/is-kenya-increasing-investment-in-health-sector-2fd1155929f0)",
          "Numbers that may have been manipulated to support a partisan message. Examples: [Uhuru's maternity care numbers exaggerated](https://pesacheck.org/uhurus-maternity-care-promises-exaggerated-2c238a3dfd9b); [Has Kiambu collected Ksh4.7bn in revenue?](https://pesacheck.org/has-kiambu-county-doubled-its-revenue-to-ksh4-7-billion-a9e16bb140f4)",
        ],
      },
      {
        type: "p",
        text: "Members of the public can also suggest claims to be fact-checked, by:",
      },
      {
        type: "ul",
        items: [
          "Emailing the newsdesk at [hello@pesacheck.org](mailto:hello@pesacheck.org)",
          "Emailing the managing editor at [doreen@pesacheck.org](mailto:doreen@pesacheck.org)",
          "Contacting us on PesaCheck's [WhatsApp tipline](https://wa.me/254780542626) at +254 780 542626",
        ],
      },
      {
        type: "p",
        text: "If claims from the public meet the public interest criteria, they'll be looked into, and feedback provided on the channel it was shared.",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "fact-checking-guidelines",
    title: "Fact-Checking Guidelines",
    blocks: [
      {
        type: "p",
        text: "We have three main rules guiding our fact-checking process:",
      },
      {
        type: "ul",
        items: [
          "**Golden Rule 1: Only one fact per fact-check.** We limit each fact check to one statement only, or a set of statements that are clearly related.",
          "**Golden Rule 2: Check every fact check.** We do our best to corroborate the fact/verification. For example, rather than using a newspaper story about the budget, we use the budget document to fact check a statement.",
          "**Golden Rule 3: Draw a conclusion based on the facts.** After all the research, corroboration and interviews, we assign a label to the fact check: **False, Satire, Partly False, False Headline, Missing Context, Hoax, Not Eligible** or **Inconclusive**.",
        ],
      },
      {
        type: "p",
        text: "We use this **checklist** to write and prepare our fact-checks:",
      },
      {
        type: "ul",
        items: [
          "Is the statement being checked included verbatim?",
          "Is there an explainer for why this statement was selected for checking?",
          "Has the category of deception been identified?",
          "Have all the sources for the fact-check been identified? Any source documents used in the fact-check that are not already online need to be annotated and uploaded to [sourceAFRICA](https://sourceafrica.net/), including any additional useful data identified in the process of fact-checking.",
          "Has the reason for labelling the statement False, Hoax, etc been indicated?",
          "Is the label (False, Hoax, etc) mentioned briefly at the top of the story, and in more detail at the end of the story?",
          "Have any links to the sources and the statement being checked been included in the body of the article?",
        ],
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "final-editing-checklist",
    title: "Final Editing Checklist",
    blocks: [
      {
        type: "p",
        text: "We use the following final editing checklist based in part on the [PolitiFact checklist](https://www.factcheck.org/our-process/):",
      },
      {
        type: "ul",
        items: [
          "Is the claim open to interpretation? Is there another way to read the claim?",
          "Is the rating fair and consistent with other fact-checks?",
          "Is the rating supported by all available facts? Do questions linger?",
        ],
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "social-media-policy",
    title: "Social Media Policy",
    blocks: [
      {
        type: "p",
        text: "Social media is a key tool that we use to distribute our fact-checks. The following are guidelines that we use to keep our social media consistent and harmonised:",
      },
      {
        type: "ul",
        items: [
          "We don't post anything that we cannot stand by.",
          "All posts follow a consistent structure — a question statement (what), a source (who) and a link to the story (where to find more). Example: FACT CHECK: Did [@Kandie_Phyllis](https://twitter.com/Kandie_Phyllis) misspeak about pledging Sh18bn for disabled kids? [@PesaCheck](https://twitter.com/PesaCheck) finds out.",
          "Each fact check needs a standard hashtag, for example [#PesaCheck](https://twitter.com/hashtag/PesaCheck).",
          "All reactions and comments are looked into, especially when they lead to potential follow-up stories that may arise out of the fact check.",
        ],
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "corrections-policy",
    title: "Corrections Policy",
    blocks: [
      {
        type: "p",
        text: "Transparency is a core value for PesaCheck, and we strive for accurate and comprehensive fact-checking. We all make mistakes sometimes, and while every error is a weakness, some errors are inevitable, and we are fully open to correcting them promptly in whatever material we publish on our platforms.",
      },
      {
        type: "p",
        text: "When we run a correction, clarification or editor's note, our goal is to tell readers, as clearly and quickly as possible, what was wrong and what is correct. Anyone should be able to understand how and why a mistake has been corrected. It is necessary to use a correction, clarification or editor's note to inform readers whenever we correct a **significant** mistake. Updates are used to reflect important new information or clarifications; corrections are for mistakes.",
      },
      {
        type: "p",
        text: "Clarification: when the content is factually correct but the language used to explain the facts is not as clear or detailed as it should be, the post will be rewritten and a clarification added to the story. A clarification can also be used to note that we initially failed to seek a comment or response that has since been added to the story.",
      },
      {
        type: "p",
        text: "Editor's notes: a correction that calls into question the entire substance of an article, raises a significant ethical matter or addresses whether an article did not meet our standards, may require an Editor's Note and be followed by an explanation of what is at issue. Therefore:",
      },
      {
        type: "ul",
        items: [
          "When an error is brought to our attention, we will indicate in comments that it has been corrected.",
          "Any erroneous information published on our social platforms will be corrected on any and all platforms it was published on.",
          "We do not attribute blame to individuals, but we may note that an error was the result of incorrect information from a trusted source.",
        ],
      },
      {
        type: "p",
        text: "The correction policy was sourced in part from **[Buzzfeed](https://www.buzzfeed.com/emmyf/buzzfeed-style-guide)** and **[The Washington Post](https://www.washingtonpost.com/news/ask-the-post/wp/2017/01/01/policies-and-standards/)**.",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "take-down-requests",
    title: "Take-Down Requests",
    blocks: [
      {
        type: "p",
        text: "As a matter of editorial policy, we do not grant take-down requests. If the subject claims that the story was inaccurate, we are prepared to investigate and, if necessary, publish a correction.",
      },
      {
        type: "p",
        text: "Stories will be updated if we checked a claim and drew a conclusion based on facts available at the time, but there is significant new information that will warrant a change in that conclusion.",
      },
      {
        type: "p",
        text: "In short, our response will be to consider whether further action is warranted, but not to remove the article as though it had never been published.",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "right-of-reply",
    title: "Right of Reply",
    blocks: [
      {
        type: "p",
        text: "Persons who are the subject of a fact-check get a reasonable opportunity to respond to us.",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "attribution",
    title: "Attribution",
    blocks: [
      {
        type: "p",
        text: "We strive to be truthful about the source of our information. Facts and quotations in a story that were not produced by our own reporting need an attribution. Attribution of material from other media must be total. Plagiarism is not permitted. We place a premium value on original reporting.",
      },
      {
        type: "p",
        text: "For further clarification, contact us at [hello@pesacheck.org](mailto:hello@pesacheck.org). You can also [find our contact information here](/about/contact-us).",
      },
    ],
    learnMore: false,
    images: [],
  },
];
