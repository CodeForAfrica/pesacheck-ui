"use client";

import Image from "next/image";

const SOCIAL_SHARE = [
  {
    name: "LinkedIn",
    icon: "/icons/social-linkedin.svg",
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Instagram",
    icon: "/icons/social-instagram.svg",
    getUrl: () => null,
  },
  {
    name: "Facebook",
    icon: "/icons/facebook.svg",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "WhatsApp",
    icon: "/icons/social-whatsapp.svg",
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    name: "Email",
    icon: "/icons/mail.svg",
    getUrl: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
];

export function ShareButtons({
  title,
  className = "",
  iconClassName = "size-5",
  labelColor = "text-white",
}: {
  title: string;
  className?: string;
  iconClassName?: string;
  labelColor?: string;
}) {
  function handleShare(getUrl: (url: string, title: string) => string | null) {
    const shareUrl = getUrl(window.location.href, title);
    if (shareUrl) window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`text-sm font-medium ${labelColor} whitespace-nowrap`}>
        Share on:
      </span>
      <span
        className={`size-[6px] shrink-0 rounded-full ${
          labelColor === "text-white" ? "bg-white/50" : "bg-neutral-300"
        }`}
      />
      {SOCIAL_SHARE.map(({ name, icon, getUrl }) => (
        <button
          key={name}
          onClick={() => handleShare(getUrl)}
          aria-label={`Share on ${name}`}
          type="button"
          className="shrink-0 cursor-pointer transition-opacity hover:opacity-70"
        >
          <Image
            src={icon}
            alt={name}
            width={20}
            height={20}
            className={iconClassName}
          />
        </button>
      ))}
    </div>
  );
}
