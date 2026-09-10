import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/SectionHeading";
import { CONTACT_WHATSAPP } from "@/lib/contact-content";
import { SOCIAL_URLS } from "@/lib/site";

function ColumnGraphic({ graphic }: { graphic: "whatsapp" | "qr" }) {
  if (graphic === "whatsapp")
    return (
      <Link
        href={SOCIAL_URLS.whatsappContact}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with PesaCheck on WhatsApp"
        className="transition-opacity hover:opacity-80"
      >
        <Image
          src="/images/whatsapp-icon.svg"
          alt="WhatsApp"
          width={120}
          height={120}
          className="size-[120px]"
        />
      </Link>
    );
  return (
    <Image
      src="/images/whatsapp-banner/qr-code.png"
      alt="WhatsApp QR code"
      width={120}
      height={120}
      className="size-[120px] rounded-md object-contain"
    />
  );
}

type Column = {
  id?: string;
  title: string;
  body: string;
  graphic: "whatsapp" | "qr";
};

export function ContactWhatsapp({
  heading = CONTACT_WHATSAPP.heading,
  phone = CONTACT_WHATSAPP.phone,
  body = CONTACT_WHATSAPP.body,
  columns = CONTACT_WHATSAPP.columns,
  bare = false,
}: {
  heading?: string;
  phone?: string;
  body?: string;
  columns?: readonly Column[];
  /** Rendered inside a page's column, which supplies the container. */
  bare?: boolean;
} = {}) {
  const inner = (
    <div className="grid items-stretch gap-8 lg:grid-cols-[505px_1fr] lg:gap-12">
      {/* Illustration placeholder */}
      <div
        className="aspect-[505/432] w-full rounded-xl bg-neutral-100"
        aria-hidden="true"
      />

      <div className="flex flex-col justify-center">
        <h2 className="text-xl font-bold text-neutral-900">{heading}</h2>
        <p className="mt-2 text-[30px] font-extrabold leading-10 text-gray-800">
          {phone}
        </p>
        <p className="mt-3 max-w-[400px] text-sm font-medium leading-5 text-neutral-900">
          {body}
        </p>

        <div className="mt-8 grid gap-8 border-t border-neutral-100 pt-6 sm:grid-cols-2 sm:gap-0">
          {columns.map((col, i) => (
            <div
              key={col.id ?? col.title}
              className={`flex flex-col gap-2 ${i > 0 ? "sm:border-l sm:border-neutral-100 sm:pl-8" : "sm:pr-8"}`}
            >
              <p className="text-base font-bold text-neutral-900">
                {col.title}
              </p>
              <p className="text-sm font-medium leading-5 text-neutral-900">
                {col.body}
              </p>
              <div className="mt-3">
                <ColumnGraphic graphic={col.graphic} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (bare) return inner;

  return <Container className="py-14 lg:py-[70px]">{inner}</Container>;
}
