"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

interface DualContactCTAProps {
  callLabel?: string;
  whatsappLabel?: string;
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "outlined" | "dark";
  className?: string;
  whatsappText?: string;
}

export default function DualContactCTA({
  callLabel = "Chiama ora",
  whatsappLabel = "WhatsApp",
  size = "md",
  variant = "filled",
  className = "",
  whatsappText,
}: DualContactCTAProps) {
  const { phone, whatsapp } = useSettings();

  const waLink = whatsappText
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappText)}`
    : `https://wa.me/${whatsapp}`;

  const sizes = {
    sm: "px-5 py-2.5 text-sm gap-2",
    md: "px-7 py-3.5 text-base gap-2.5",
    lg: "px-9 py-4.5 text-lg gap-3",
  };

  const iconSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-5.5 h-5.5" };

  const callStyles =
    variant === "filled"
      ? "bg-stitch-green hover:bg-stitch-green-light text-white shadow-lg shadow-stitch-green/20 hover:shadow-stitch-green/30"
      : variant === "dark"
      ? "bg-stitch-green hover:bg-stitch-green-light text-white shadow-lg shadow-stitch-green/20"
      : "bg-stitch-ivory hover:bg-white text-stitch-green border-2 border-stitch-green shadow-md";

  const waStyles =
    variant === "filled"
      ? "bg-stitch-green hover:bg-stitch-green-light text-white shadow-lg shadow-stitch-green/20 hover:shadow-stitch-green/30"
      : variant === "dark"
      ? "bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg shadow-green-900/20"
      : "bg-stitch-ivory hover:bg-white text-stitch-green border-2 border-stitch-green shadow-md";

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${className}`}>
      <a
        href={`tel:${phone}`}
        className={`inline-flex items-center justify-center rounded-lg font-label tracking-widest uppercase transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] min-w-[180px] ${sizes[size]} ${callStyles}`}
      >
        <Phone className={iconSizes[size]} />
        {callLabel}
      </a>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center rounded-lg font-label tracking-widest uppercase transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] min-w-[180px] ${sizes[size]} ${waStyles}`}
      >
        <MessageCircle className={iconSizes[size]} />
        {whatsappLabel}
      </a>
    </div>
  );
}
