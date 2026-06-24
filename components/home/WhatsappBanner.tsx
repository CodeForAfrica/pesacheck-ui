import { MessageDotsCircle } from "@untitledui/icons/MessageDotsCircle";
import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";
import {
  WHATSAPP_BANNER,
  WHATSAPP_COLUMNS,
  type WhatsappColumn,
} from "@/lib/home-content";

function ColumnGraphic({ graphic }: { graphic: WhatsappColumn["graphic"] }) {
  if (graphic === "whatsapp")
    return (
      <Image
        src="/images/whatsapp-icon.svg"
        alt="WhatsApp"
        width={120}
        height={120}
        className="size-[120px]"
      />
    );
  if (graphic === "qr")
    return (
      <Image
        src="/images/whatsapp-banner/qr-code.png"
        alt="WhatsApp QR code"
        width={120}
        height={120}
        className="size-[120px] rounded-md object-contain"
      />
    );
  if (graphic === "message")
    return (
      <MessageDotsCircle size={120} className="size-[120px]" aria-hidden />
    );
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
              key={col.title}
              className={`flex flex-col items-start justify-between gap-3 text-left ${i > 0 ? "lg:border-l lg:border-neutral-200 lg:px-8" : ""}`}
            >
              <div className="flex flex-col gap-3">
                <p className="whitespace-nowrap text-base font-bold text-neutral-900">
                  {col.title}
                </p>
                {col.highlight && (
                  <p className="whitespace-nowrap text-[30px] font-extrabold leading-10 text-gray-800">
                    {col.highlight}
                  </p>
                )}
                <p className="text-sm font-medium leading-5 text-neutral-900">
                  {col.body}
                </p>
              </div>
              <ColumnGraphic graphic={col.graphic} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
