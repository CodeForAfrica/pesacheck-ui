import type { Metadata } from "next";
import { PrivacyBody } from "@/components/privacy/PrivacyBody";
import { PrivacyHero } from "@/components/privacy/PrivacyHero";

export const metadata: Metadata = {
  title: "Privacy Policy — PesaCheck",
  description:
    "How PesaCheck and Code for Africa collect, use and protect your personal data, your data protection rights, and how we use cookies.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PrivacyHero />
      <PrivacyBody />
    </>
  );
}
