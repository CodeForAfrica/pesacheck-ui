import { ChevronDown } from "@untitledui/icons/ChevronDown";
import { Mail01 } from "@untitledui/icons/Mail01";
import { MarkerPin01 } from "@untitledui/icons/MarkerPin01";
import { PhoneCall01 } from "@untitledui/icons/PhoneCall01";
import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import {
  CONTACT_FORM,
  CONTACT_HQ,
  CONTACT_SOCIALS,
  type ContactField,
} from "@/lib/contact-content";

// Shared field shell: label + required asterisk above the control.
function Field({
  field,
  children,
}: {
  field: ContactField;
  children: React.ReactNode;
}) {
  return (
    <div className={field.span === "full" ? "sm:col-span-2" : ""}>
      <label
        htmlFor={field.name}
        className="flex gap-0.5 text-sm font-medium text-neutral-800"
      >
        {field.label}
        {field.required && <span className="text-[#fc0d1b]">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const CONTROL =
  "w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-500 focus:border-pesacheck-blue focus:outline-none";

function FormControl({ field }: { field: ContactField }) {
  if (field.type === "textarea") {
    return (
      <textarea
        id={field.name}
        name={field.name}
        placeholder={field.placeholder}
        rows={4}
        className={`${CONTROL} min-h-[104px] resize-none py-3`}
      />
    );
  }

  if (field.type === "select") {
    return (
      <div className="relative">
        <select
          id={field.name}
          name={field.name}
          defaultValue=""
          className={`${CONTROL} h-12 appearance-none pr-10 text-neutral-500`}
        >
          <option value="" disabled>
            {field.placeholder}
          </option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt} className="text-neutral-900">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
          aria-hidden
        />
      </div>
    );
  }

  const FieldIcon = field.icon;
  return (
    <div className="relative flex h-12 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 focus-within:border-pesacheck-blue">
      {FieldIcon && <FieldIcon size={16} className="shrink-0" aria-hidden />}
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        placeholder={field.placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
      />
    </div>
  );
}

function ContactRow({
  icon: ContactIcon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-sm font-medium text-neutral-900">
      <ContactIcon size={24} className="mt-px shrink-0" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

export function ContactForm() {
  return (
    <Container className="py-14 lg:py-[70px]">
      <SectionHeading title={CONTACT_HQ.heading} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
        {/* Message form */}
        <div className="rounded-xl border border-neutral-100 bg-white p-6 lg:p-7">
          <h3 className="text-xl font-semibold text-neutral-900">
            {CONTACT_FORM.heading}
          </h3>
          <form className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {CONTACT_FORM.fields.map((field) => (
              <Field key={field.name} field={field}>
                <FormControl field={field} />
              </Field>
            ))}
            <div className="sm:col-span-2">
              {/* Static visual only — no submission backend. */}
              <button
                type="button"
                className="rounded-lg bg-pesacheck-blue px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-pesacheck-blue/90"
              >
                {CONTACT_FORM.submitLabel}
              </button>
            </div>
          </form>
        </div>

        {/* Supporting photo */}
        <div className="relative aspect-[400/453] w-full overflow-hidden rounded-xl bg-neutral-100 lg:aspect-auto">
          <Image
            src="/images/contact/contact-form.png"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 400px"
            className="object-cover"
          />
        </div>
      </div>

      {/* HQ contact details */}
      <div className="mt-10 flex flex-col gap-3">
        <ContactRow icon={MarkerPin01}>{CONTACT_HQ.address}</ContactRow>
        <ContactRow icon={Mail01}>{CONTACT_HQ.email}</ContactRow>
        <ContactRow icon={PhoneCall01}>{CONTACT_HQ.phone}</ContactRow>

        <div className="mt-2 flex items-center gap-4">
          <span className="text-sm font-medium text-neutral-900">
            Follow Us:
          </span>
          <div className="flex items-center gap-3">
            {CONTACT_SOCIALS.map((social, i) => {
              const SocialIcon = social.icon;
              return (
                <div key={social.label} className="flex items-center gap-3">
                  {i > 0 && <span className="h-2.5 w-px bg-neutral-200" />}
                  <a href={social.href} aria-label={social.label}>
                    <SocialIcon size={24} color={social.color} aria-hidden />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Container>
  );
}
