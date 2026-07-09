/**
 * Page-specific content for the About → Contact Us page, transcribed from the
 * Figma design (node 2866:2935). Site-wide content (nav, footer, allies/partners)
 * lives in `lib/site.ts`; the Allies/Partners and footer chrome at the bottom of
 * the design are rendered by the shared layout Footer, not this page.
 */
import { FiMail, FiUser } from "react-icons/fi";

export const CONTACT_HERO = {
  eyebrow: "Contact Pesacheck",
  title: "We would like to hear from you",
};

// HQ contact block beneath the form.
export const CONTACT_HQ = {
  heading: "Pesacheck HQ",
  address:
    "Nairobi Garage, 8th Floor, Pinetree Plaza, Kamburu Drive, Nairobi, Kenya.",
  email: "hello@pesacheck.org",
  phone: "+254 769 014382",
};

import type { ElementType } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SOCIAL_URLS } from "@/lib/site";

export const CONTACT_SOCIALS: {
  icon: ElementType;
  color: string;
  label: string;
  href: string;
}[] = [
  {
    icon: FaLinkedinIn,
    color: "#0A66C2",
    label: "LinkedIn",
    href: SOCIAL_URLS.linkedin,
  },
  {
    icon: FaInstagram,
    color: "#E1306C",
    label: "Instagram",
    href: SOCIAL_URLS.instagram,
  },
  {
    icon: FaFacebook,
    color: "#0866FF",
    label: "Facebook",
    href: SOCIAL_URLS.facebook,
  },
  {
    icon: FaWhatsapp,
    color: "#25D366",
    label: "WhatsApp",
    href: SOCIAL_URLS.whatsapp,
  },
  {
    icon: FaXTwitter,
    color: "#000000",
    label: "Twitter / X",
    href: SOCIAL_URLS.twitter,
  },
];

// "Send us a message" form fields. Static visual only — no submission backend.
export type ContactField = {
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  /** Layout span within the form's 2-col grid. */
  span: "half" | "full";
  type: "text" | "email" | "select" | "textarea";
  icon?: ElementType;
  options?: string[];
};

export const CONTACT_FORM = {
  heading: "Send us a message",
  submitLabel: "Submit",
  fields: [
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter Full Name",
      required: true,
      span: "half",
      type: "text",
      icon: FiUser,
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter email",
      required: true,
      span: "half",
      type: "email",
      icon: FiMail,
    },
    {
      name: "subject",
      label: "Subject",
      placeholder: "Add subject",
      required: true,
      span: "full",
      type: "select",
      options: [
        "General enquiry",
        "Report a claim",
        "Partnerships",
        "Media",
        "Other",
      ],
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Add description",
      required: true,
      span: "full",
      type: "textarea",
    },
  ] satisfies ContactField[],
};

// Country office cards in the "Locations" grid (4 columns, row-major order).
export type LocationCard = {
  country: string;
  city?: string;
  name?: string;
  email: string;
  phone?: string;
};

export const CONTACT_LOCATIONS: LocationCard[] = [
  {
    country: "Benin",
    city: "Cotonou",
    name: "Josaphat Finogbé",
    email: "josaphat@pesacheck.org",
  },
  {
    country: "Burkina Faso",
    city: "Ouagadougou",
    name: "Françoise Dembele",
    email: "francoise.dembele@pesacheck.org",
  },
  {
    country: "Burundi",
    city: "Bujumbura",
    name: "Cedrick Irakoze",
    email: "cedrick@pesacheck.org",
  },
  {
    country: "Cameroon",
    city: "Douala",
    name: "Nicole Minim",
    email: "nicole@pesacheck.org",
  },
  {
    country: "Central African Republic (CAR)",
    name: "Doreen Wainainah",
    email: "doreen@pesacheck.org",
  },
  {
    country: "Cote d’Ivoire",
    name: "Mardochée Boli",
    email: "mardochee@pesacheck.org",
  },
  {
    country: "Democratic Republic of Congo (DRC)",
    name: "Doreen Wainainah",
    email: "doreen@pesacheck.org",
  },
  {
    country: "Ethiopia",
    city: "Addis Ababa",
    name: "Eden Berhane",
    email: "eden@pesacheck.org",
  },
  {
    country: "Guinea",
    city: "Conakry",
    name: "Arsene Assogba",
    email: "arsene@pesacheck.org",
  },
  {
    country: "Mali",
    city: "Bamako",
    name: "Mardochée Boli",
    email: "mardochee@pesacheck.org",
  },
  { country: "Niger", name: "Simon Muli", email: "simon@pesacheck.org" },
  {
    country: "Nigeria",
    name: "Doreen Wainainah",
    email: "doreen@pesacheck.org",
  },
  {
    country: "Senegal",
    name: "Eve Sokeng",
    email: "eve@pesacheck.org",
  },
  {
    country: "Somalia",
    city: "Mogadishu",
    name: "Hassan Istiila",
    email: "hassan.osman@pesacheck.org",
  },
  {
    country: "South Africa",
    city: "Cape Town",
    name: "Christiaan van der Merwe",
    email: "christiaan@pesacheck.org",
  },
  { country: "Tanzania", name: "Simon Muli", email: "simon@pesacheck.org" },
  {
    country: "Uganda",
    city: "Kampala",
    name: "Pius Enywaru",
    email: "pius@pesacheck.org",
  },
];

// WhatsApp call-out section.
export const CONTACT_WHATSAPP = {
  heading: "We are on whatsapp!",
  phone: "+254 780 542626",
  body: "Send us claims that need checking on our dedicated WhatsApp tip-line, or follow our channel for the latest fact-checks from the PesaCheck team.",
  columns: [
    {
      graphic: "whatsapp" as const,
      title: "Follow our channel",
      body: "We send updates every thursday",
    },
    {
      graphic: "qr" as const,
      title: "Something fishy needs sleuthing?",
      body: "Send us photos, videos or text with the details and we’ll investigate",
    },
  ],
};

// Licensing & syndication section.
export const CONTACT_LICENSING = {
  heading: "Licensing and syndication",
  body: "PesaCheck is an indigenous initiative that is pioneering frontline fact-checking across Africa. Initially focused on verifying the financial and other statistical numbers quoted by public figures in Kenya, Tanzania and Uganda, PesaCheck is now Africa’s largest with full-time staff in 18 countries in both east and west Africa, as well as across the Sahel. PesaCheck fact-checks in two international languages (English and French), as well as major African languages such as Amharic, Kiswahili and Somali. Our network helps track political promises by politicians (through our Wajibisha/PromiseTracker toolkit), helps unpack budget and census data (through our PesaYetu and TaxClock platforms), and builds machine learning/artificial intelligence tools (such as DebunkBot) to help automate verification. PesaCheck also helps watchdog media and NGOs establish their own standalone fact-check teams, and works with universities across the continent to train a new generation of civic watchdogs. PesaCheck is an initiative of Code for Africa (CfA) and was co-founded in 2016 by Justin Arenstein and Catherine Gicheru as part of their ICFJ Knight Fellowships, underwritten by an innovateAFRICA.fund award",
  imprintHeading: "Imprint",
  imprint: [
    "Owner of the website: Pesacheck",
    "Registered business address: 112 Loop Street, Cape Town, 8000",
    "Contact information: hello@pesacheck.org",
    "Company registration numbers: 168-092-NPO (South Africa), CPR/2016/220101 (Kenya) and RC 1503312 (Nigeria)",
  ],
};
