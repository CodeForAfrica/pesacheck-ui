import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { WHATSAPP_BANNER, WHATSAPP_COLUMNS, type WhatsappColumn } from "@/lib/home-content";

function ColumnGraphic({ graphic }: { graphic: WhatsappColumn["graphic"] }) {
  if (graphic === "whatsapp")
    return (
      <Image
        src="/images/whatsapp-icon.svg"
        alt="WhatsApp"
        width={40}
        height={40}
        className="size-18"
      />
    );
  if (graphic === "qr")
    return (
      <Image
        src="/images/whatsapp-banner/qr-code.png"
        alt="WhatsApp QR code"
        width={64}
        height={64}
        className="size-16 rounded-md object-contain"
      />
    );
  if (graphic === "message")
    return <Icon name="message-dots-circle" size={64} className="size-16" />;
}

export function WhatsappBanner() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <div className="relative aspect-[1240/216] w-full overflow-hidden rounded-lg">
          <Image
            src={WHATSAPP_BANNER}
            alt="Your direct line to the facts"
            fill
            sizes="(max-width: 1280px) 100vw, 1240px"
            className="object-cover"
          />
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {WHATSAPP_COLUMNS.map((col, i) => (
            <div
              key={i}
              className={`flex flex-col gap-3 lg:px-8 ${i > 0 ? "lg:border-l lg:border-neutral-200" : ""}`}
            >
              <ColumnGraphic graphic={col.graphic} />
              <p className="text-base font-bold text-neutral-900">{col.title}</p>
              {col.highlight && (
                <p className="text-[30px] font-extrabold leading-10 text-gray-800">
                  {col.highlight}
                </p>
              )}
              <p className="text-sm font-medium leading-5 text-neutral-900">{col.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
