import type { Metadata } from "next";
import { ContactForm } from "@/components/about/ContactForm";
import { ContactHero } from "@/components/about/ContactHero";
import { ContactLicensing } from "@/components/about/ContactLicensing";
import { ContactLocations } from "@/components/about/ContactLocations";
import { ContactWhatsapp } from "@/components/about/ContactWhatsapp";

export const metadata: Metadata = {
  title: "Contact Us — PesaCheck",
  description:
    "Get in touch with PesaCheck, Africa's largest indigenous fact-checking organisation — our HQ, country offices, WhatsApp tip line and licensing details.",
};

export default function ContactUsPage() {
  return (
    <>
      <ContactHero />
      <ContactForm />
      <ContactLocations />
      <ContactWhatsapp />
      <ContactLicensing />
    </>
  );
}
