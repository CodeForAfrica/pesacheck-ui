import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";
import { CONTACT_WHATSAPP } from "@/lib/contact-content";

function ColumnGraphic({ graphic }: { graphic: "whatsapp" | "qr" }) {
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

export function ContactWhatsapp() {
  return (
    <Container className="py-14 lg:py-[70px]">
      <div className="grid items-stretch gap-8 lg:grid-cols-[505px_1fr] lg:gap-12">
        {/* Illustration placeholder */}
        <div
          className="aspect-[505/432] w-full rounded-xl bg-neutral-100"
          aria-hidden="true"
        />

        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-bold text-neutral-900">
            {CONTACT_WHATSAPP.heading}
          </h2>
          <p className="mt-2 text-[30px] font-extrabold leading-10 text-gray-800">
            {CONTACT_WHATSAPP.phone}
          </p>
          <p className="mt-3 max-w-[400px] text-sm font-medium leading-5 text-neutral-900">
            {CONTACT_WHATSAPP.body}
          </p>

          <div className="mt-8 grid gap-8 border-t border-neutral-100 pt-6 sm:grid-cols-2 sm:gap-0">
            {CONTACT_WHATSAPP.columns.map((col, i) => (
              <div
                key={col.title}
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
    </Container>
  );
}
