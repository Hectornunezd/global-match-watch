import { useState } from "react";

interface Props {
  src: string | null | undefined;
  name: string;
  className?: string;
  /** Fallback initials font size class, e.g. "text-[10px]" */
  fallbackTextClassName?: string;
}

/**
 * Flag image with graceful fallback. If the image fails to load (or no src is
 * provided), renders a square with the team's initials on a muted surface.
 */
export function Flag({ src, name, className, fallbackTextClassName }: Props) {
  const [errored, setErrored] = useState(false);
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  if (!src || errored) {
    return (
      <span
        aria-label={name}
        className={
          "flex shrink-0 items-center justify-center rounded-sm border border-border bg-muted font-mono uppercase text-muted-foreground " +
          (fallbackTextClassName ?? "text-[10px]") +
          (className ? " " + className : "")
        }
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      onError={() => setErrored(true)}
      className={"object-cover " + (className ?? "")}
    />
  );
}
