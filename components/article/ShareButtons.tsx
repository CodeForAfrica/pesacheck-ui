"use client";

import { Mail01 } from "@untitledui/icons/Mail01";
import type { IconType } from "react-icons";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SOCIAL_SHARE: {
  name: string;
  Icon: IconType;
  color: string;
  getUrl: (url: string, title: string) => string | null;
}[] = [
  {
    name: "LinkedIn",
    Icon: FaLinkedinIn,
    color: "#0A66C2",
    getUrl: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Instagram",
    Icon: FaInstagram,
    color: "#E1306C",
    getUrl: () => null,
  },
  {
    name: "Facebook",
    Icon: FaFacebook,
    color: "#0866FF",
    getUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "WhatsApp",
    Icon: FaWhatsapp,
    color: "#25D366",
    getUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    name: "X",
    Icon: FaXTwitter,
    color: "#000000",
    getUrl: (url, title) =>
      `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
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
      {SOCIAL_SHARE.map(({ name, Icon, color, getUrl }) => (
        <button
          key={name}
          onClick={() => handleShare(getUrl)}
          aria-label={`Share on ${name}`}
          type="button"
          className="shrink-0 cursor-pointer transition-opacity hover:opacity-70"
        >
          <Icon color={color} aria-hidden className={iconClassName} />
        </button>
      ))}
      <button
        onClick={() => {
          const url = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(window.location.href)}`;
          window.open(url);
        }}
        aria-label="Share via Email"
        type="button"
        className="shrink-0 cursor-pointer transition-opacity hover:opacity-70"
      >
        <Mail01
          size={20}
          color={labelColor === "text-white" ? "white" : "#374151"}
          aria-hidden
          className={iconClassName}
        />
      </button>
    </div>
  );
}
