import { useMemo, useState } from "react";

interface Props {
  src: string | null | undefined;
  name: string;
  className?: string;
  /** Fallback initials font size class, e.g. "text-[10px]" */
  fallbackTextClassName?: string;
}

/** Extract ISO alpha-2 country code from a flag URL like
 *  https://flagcdn.com/w80/mx.png  ->  "mx" */
function extractCountryCode(src: string | null | undefined): string | null {
  if (!src) return null;
  const m = src.match(/\/([a-z]{2})\.(png|svg|webp|jpg|jpeg)(?:$|\?)/i);
  return m ? m[1].toLowerCase() : null;
}

/** Build an ordered list of fallback flag URLs from multiple providers so a
 *  single CDN being blocked (corporate proxy, country-level filter, ad-block
 *  list) does not break the experience. */
function buildSources(src: string | null | undefined): string[] {
  const list: string[] = [];
  if (src) list.push(src);
  const code = extractCountryCode(src);
  if (code) {
    // Different CDNs / providers — if one is blocked the next is tried.
    list.push(`https://flagcdn.com/w80/${code}.png`);
    list.push(`https://flagcdn.com/${code}.svg`);
    list.push(`https://hatscripts.github.io/circle-flags/flags/${code}.svg`);
    list.push(`https://flagsapi.com/${code.toUpperCase()}/flat/64.png`);
  }
  // De-duplicate while preserving order
  return Array.from(new Set(list));
}

/** Convert ISO alpha-2 country code into the regional-indicator flag emoji. */
function codeToEmoji(code: string | null): string | null {
  if (!code || code.length !== 2) return null;
  const A = 0x1f1e6;
  const a = "a".charCodeAt(0);
  const cp = [...code.toLowerCase()].map((c) => A + (c.charCodeAt(0) - a));
  return String.fromCodePoint(...cp);
}

/**
 * Flag image with multi-CDN fallback. If every remote source fails, falls
 * back to the country's emoji flag, and finally to text initials.
 */
export function Flag({ src, name, className, fallbackTextClassName }: Props) {
  const sources = useMemo(() => buildSources(src), [src]);
  const [idx, setIdx] = useState(0);
  const [allFailed, setAllFailed] = useState(sources.length === 0);

  const emoji = useMemo(() => codeToEmoji(extractCountryCode(src)), [src]);
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  if (allFailed) {
    return (
      <span
        aria-label={name}
        className={
          "flex shrink-0 items-center justify-center rounded-sm border border-border bg-muted font-mono uppercase text-muted-foreground " +
          (fallbackTextClassName ?? "text-[10px]") +
          (className ? " " + className : "")
        }
      >
        {emoji ?? initials}
      </span>
    );
  }

  return (
    <img
      key={sources[idx]}
      src={sources[idx]}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (idx + 1 < sources.length) {
          setIdx(idx + 1);
        } else {
          setAllFailed(true);
        }
      }}
      className={"object-cover " + (className ?? "")}
    />
  );
}
