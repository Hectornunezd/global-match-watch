import { useState } from "react";
import type { Team } from "@/lib/data";

/** Club crest with graceful fallback to the 3-letter code. */
export function TeamCrest({
  team,
  size = 36,
  className = "",
}: {
  team: Pick<Team, "flag_url" | "short_code" | "name_en">;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const code = (team.short_code ?? team.name_en ?? "").slice(0, 3).toUpperCase();

  if (!team.flag_url || failed) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center border border-primary/40 bg-primary/10 font-display text-[11px] font-bold tracking-wider text-primary ${className}`}
        style={{ width: size, height: size }}
      >
        {code || "—"}
      </span>
    );
  }

  return (
    <img
      src={team.flag_url}
      alt={`${team.name_en} crest`}
      width={size}
      height={size}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
