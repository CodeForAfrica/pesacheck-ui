/**
 * Shape of the FAQs page's questions.
 *
 * The copy itself lives in Superdesk — one article per question in the
 * `Page — FAQs — Questions` list, grouped by the `faq_group` vocabulary (see
 * `lib/data/faqs.ts`). Only the types remain here, because the mapper and the
 * renderer both need to agree on them.
 */
export type FaqItem = { question: string; answer: string };
export type FaqGroup = { title: string; items: FaqItem[] };
