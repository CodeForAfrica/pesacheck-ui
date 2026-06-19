/**
 * Page-specific content for the About → FAQs page, transcribed from the Figma
 * design (node 2866:3990). Site-wide chrome (header, footer, allies/partners)
 * is rendered by the shared layout, not this page.
 *
 * The questions/answers in the design are Untitled-UI placeholder copy; they are
 * reproduced verbatim here so the page matches the design. Swap them for real
 * PesaCheck FAQ content by editing the arrays below.
 */

export const FAQ_HERO = {
  title: "Frequently Asked Questions",
  subtitle: "Learn more about Pesacheck Frequently Asked Questions",
};

export type FaqItem = { question: string; answer: string };
export type FaqGroup = { title: string; items: FaqItem[] };

// Reusable answer strings (the design repeats these across groups).
const A_FREE_TRIAL =
  "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.";
const A_INVOICE =
  "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.";
const A_CHANGE_PLAN =
  "Of course. Our pricing scales with your company. Chat to our friendly team to find a solution that works for you.";
const A_BILLING =
  "Plans are per workspace, not per account. You can upgrade one workspace, and still have any number of free workspaces.";
const A_CANCELLATION =
  "We understand that things change. You can cancel your plan at any time and we’ll refund you the difference already paid.";
const A_ACCOUNT_EMAIL =
  "You can change the email address associated with your account by going to untitledui.com/account from a laptop or desktop.";

// Items are listed in row-major order (left→right, top→bottom) so they fill the
// responsive grid the same way the Figma columns read.
export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Questions about Articles",
    items: [
      { question: "Is there a free trial available?", answer: A_FREE_TRIAL },
      { question: "Can I change my plan later?", answer: A_CHANGE_PLAN },
      { question: "What is your cancellation policy?", answer: A_CANCELLATION },
      { question: "Can other info be added to an invoice?", answer: A_INVOICE },
      { question: "How does billing work?", answer: A_BILLING },
      {
        question: "How do I change my account email?",
        answer: A_ACCOUNT_EMAIL,
      },
    ],
  },
  {
    title: "Questions about Policy",
    items: [
      { question: "Is there a free trial available?", answer: A_FREE_TRIAL },
      { question: "Can I change my plan later?", answer: A_CHANGE_PLAN },
      { question: "What is your cancellation policy?", answer: A_CANCELLATION },
      { question: "Can other info be added to an invoice?", answer: A_INVOICE },
    ],
  },
  {
    title: "Questions about using the site",
    items: [
      { question: "Is there a free trial available?", answer: A_FREE_TRIAL },
      { question: "Can I change my plan later?", answer: A_CHANGE_PLAN },
    ],
  },
];

export const FAQ_CTA = {
  heading: "Still have questions?",
  body: "Can’t find the answer you’re looking for? Please chat to our friendly team.",
  buttonLabel: "Get in touch",
  href: "/about/contact-us",
};
