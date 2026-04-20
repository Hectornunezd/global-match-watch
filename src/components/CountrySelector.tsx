import { useEffect, useRef, useState } from "react";
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

const flagUrl = (a2: string) => `https://flagcdn.com/w40/${a2.toLowerCase()}.png`;

export function CountrySelector({
  initialAlpha2,
  onChange,
}: {
  initialAlpha2: string;
  onChange?: (alpha3: string) => void;
}) {
  const [value, setValue] = useState(initialAlpha2);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = getCountryCookieClient();
    if (stored) setValue(stored);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const current = COUNTRIES.find((c) => c.code === value) ?? COUNTRIES[0];

  const select = (code: string) => {
    setValue(code);
    setOpen(false);
    setCountryCookieClient(code);
    const a3 = alpha2ToAlpha3(code);
    if (typeof window !== "undefined") {
      const w = window as unknown as { gtag?: (...a: unknown[]) => void };
      w.gtag?.("event", "country_change", { country: code });
    }
    if (onChange) {
      if (a3) onChange(a3);
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-primary"
      >
        <img
          src={flagUrl(current.code)}
          alt=""
          loading="lazy"
          className="h-3.5 w-5 rounded-sm object-cover"
        />
        <span>{current.name}</span>
        <svg
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-2 max-h-72 w-56 overflow-y-auto rounded-2xl border border-border bg-card py-1 shadow-lg"
        >
          {COUNTRIES.map((c) => {
            const isActive = c.code === value;
            return (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => select(c.code)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-xs uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <img
                    src={flagUrl(c.code)}
                    alt=""
                    loading="lazy"
                    className="h-3.5 w-5 shrink-0 rounded-sm object-cover"
                  />
                  <span>{c.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
