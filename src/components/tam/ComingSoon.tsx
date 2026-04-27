import { Link } from "@tanstack/react-router";
import { SiteHeader } from "./SiteHeader";
import { TactileButton } from "./TactileButton";
import { Chip } from "./Chip";

export function ComingSoon({
  title,
  kicker,
  blurb,
  ship,
}: {
  title: string;
  kicker: string;
  blurb: string;
  /** Optional bullet list of what will land in this section. */
  ship?: string[];
}) {
  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-[820px] px-5 py-16 sm:px-8 sm:py-24">
        <Chip tone="primary" className="mb-4">
          {kicker}
        </Chip>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight">{title}</h1>
        <p className="mt-3 text-muted-foreground max-w-[55ch]">{blurb}</p>

        {ship && ship.length > 0 && (
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {ship.map((s) => (
              <li
                key={s}
                className="rounded-xl border-2 border-ink bg-card px-4 py-3 font-mono-ui text-[12px] shadow-[var(--shadow-card)]"
              >
                <span className="text-primary mr-2">▸</span>
                {s}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/">
            <TactileButton size="md" variant="ghost">
              ← Home
            </TactileButton>
          </Link>
          <Link to="/arena" search={{ pet: "", mode: "quick" }}>
            <TactileButton size="md">Enter the arena</TactileButton>
          </Link>
        </div>
      </main>
    </div>
  );
}
