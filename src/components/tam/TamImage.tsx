import { useState } from "react";
import { cn } from "@/lib/utils";

export const DEFAULT_PET_FALLBACK = "/assets/fallback/default-pet.png";

interface TamImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  badgeClassName?: string;
  fallbackLabel?: string;
  onFallback?: () => void;
}

export function TamImage({
  src,
  alt,
  className,
  badgeClassName,
  fallbackLabel = "asset fallback",
  onFallback,
}: TamImageProps) {
  const [fallback, setFallback] = useState(!src);
  const resolvedSrc = fallback || !src ? DEFAULT_PET_FALLBACK : src;

  return (
    <span className="relative inline-flex items-center justify-center">
      <img
        src={resolvedSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => {
          if (!fallback) {
            setFallback(true);
            onFallback?.();
          }
        }}
        className={cn("object-contain", className)}
      />
      {fallback && (
        <span
          className={cn(
            "absolute bottom-1 left-1 rounded bg-ink/85 px-1.5 py-0.5 font-mono-ui text-[8px] text-background shadow-sm",
            badgeClassName,
          )}
        >
          {fallbackLabel}
        </span>
      )}
    </span>
  );
}
