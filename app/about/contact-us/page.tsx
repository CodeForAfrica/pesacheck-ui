import type { Metadata } from "next";
import { ContactHero } from "@/components/about/ContactHero";
import { ContactForm } from "@/components/about/ContactForm";
import { ContactLocations } from "@/components/about/ContactLocations";
import { ContactWhatsapp } from "@/components/about/ContactWhatsapp";
import { ContactLicensing } from "@/components/about/ContactLicensing";

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
