import { renderBody } from "@/lib/data/body";
import { articleExtra, type RawArticle } from "@/lib/data/map";
import { ANY_ROUTE, getContentListArticles } from "@/lib/data/stories";

/**
 * Superdesk custom fields for the ways to reach someone. Shared by the HQ
 * block and the country office cards, which want the same three things — a
 * second set named `office_*` would be the same fields under another name.
 */
export const CONTACT_FIELDS = {
  address: "contact_address",
  email: "contact_email",
  phone: "contact_phone",
} as const;

export const CONTACT_LOCATIONS_LIST = "Page — Contact Us — Locations";
export const CONTACT_WHATSAPP_LIST = "Page — Contact Us — WhatsApp";

/** One country office card. */
export type ContactLocation = {
  /** The article slug, unique per card. */
  id: string;
  country: string;
  city?: string;
  /** The person who staffs it. */
  name?: string;
  email: string;
  phone?: string;
};

/** One of the two columns beside the WhatsApp number. */
export type WhatsappColumn = {
  id: string;
  title: string;
  body: string;
  /** Which artwork sits under the copy. */
  graphic: "whatsapp" | "qr";
};

/** Rich text as a single line — these fields sit in cards, not in prose. */
function plain(html: string | null | undefined): string {
  return (
    renderBody(html)
      ?.replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim() ?? ""
  );
}

/**
 * Country offices in curated order: headline is the country, lead the city and
 * body the person who staffs it, with the ways to reach them in custom fields.
 *
 * A card with no email is dropped — it is a directory entry that cannot be
 * used, and the design gives it no other action.
 */
export async function getContactLocations(
  listName: string = CONTACT_LOCATIONS_LIST,
): Promise<ContactLocation[]> {
  const articles = await getContentListArticles(listName, ANY_ROUTE);

  return articles
    .map((article: RawArticle): ContactLocation | null => {
      const email = articleExtra(article, CONTACT_FIELDS.email)?.trim();
      if (!email) return null;

      return {
        id: article.slug,
        country: article.title,
        city: plain(article.lead) || undefined,
        name: plain(article.body) || undefined,
        email,
        phone: articleExtra(article, CONTACT_FIELDS.phone)?.trim() || undefined,
      };
    })
    .filter((location): location is ContactLocation => location != null);
}

/**
 * The columns beside the WhatsApp number, in curated order.
 *
 * The artwork is chosen by position rather than authored: the design has
 * exactly two columns, the channel link and the QR code, and which is which is
 * a fact about the layout rather than something an editor decides. Reordering
 * the list swaps them, which is the only choice there is to make.
 */
export async function getWhatsappColumns(
  listName: string = CONTACT_WHATSAPP_LIST,
): Promise<WhatsappColumn[]> {
  const articles = await getContentListArticles(listName, ANY_ROUTE);

  return articles.slice(0, 2).map((article: RawArticle, i: number) => ({
    id: article.slug,
    title: article.title,
    body: plain(article.body || article.lead),
    graphic: i === 0 ? ("whatsapp" as const) : ("qr" as const),
  }));
}
