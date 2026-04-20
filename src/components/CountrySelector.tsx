import { useEffect, useState } from "react";
import { setCountryCookieClient, getCountryCookieClient, alpha2ToAlpha3 } from "@/lib/geolocation";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "MX", name: "Mexico" },
  { code: "ES", name: "Spain" },
  { code: "AR", name: "Argentina" },
  { code: "CO", name: "Colombia" },
  { code: "BR", name: "Brazil" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "IN", name: "India" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "QA", name: "Qatar" },
];

export function CountrySelector({
  initialAlpha2,
  onChange,
}: {
  initialAlpha2: string;
  onChange?: (alpha3: string) => void;
}) {
  const [value, setValue] = useState(initialAlpha2);

  useEffect(() => {
    const stored = getCountryCookieClient();
    if (stored) setValue(stored);
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        setValue(v);
        setCountryCookieClient(v);
        const a3 = alpha2ToAlpha3(v);
        if (a3) onChange?.(a3);
        if (typeof window !== "undefined") {
          const w = window as unknown as { gtag?: (...a: unknown[]) => void };
          w.gtag?.("event", "country_change", { country: v });
          // Reload to refetch country-filtered data
          window.location.reload();
        }
      }}
      className="rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-primary"
    >
      {COUNTRIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
