import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Shell } from "@/components/chrome";
import { Input } from "@/components/ui/input";
import { VAULT, type VaultDoc } from "@/lib/data";
import { cn } from "@/lib/utils";

const KINDS = ["All", "SOP", "Standard", "Manual", "Drawing", "Template", "Mail"] as const;

export function VaultPage() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("All");
  const [open, setOpen] = useState<string>(VAULT[0]?.id ?? "");

  const rows = useMemo(() => {
    return VAULT.filter((d) => {
      const hay = `${d.title} ${d.excerpt} ${d.kind}`.toLowerCase();
      const matchQ = q.trim() === "" || hay.includes(q.toLowerCase());
      const matchK = kind === "All" || d.kind === kind;
      return matchQ && matchK;
    });
  }, [q, kind]);

  const active: VaultDoc | undefined = rows.find((r) => r.id === open) ?? rows[0];

  return (
    <Shell mode="app">
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col md:flex-row">
        <section className="flex min-h-0 w-full flex-col border-border md:w-96 md:border-r lg:w-[28rem]">
          <div className="space-y-3 p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-ok">Knowledge vault</p>
            <h1 className="font-display text-2xl font-medium tracking-tight">Manuals, SOPs, mail.</h1>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the local index"
                className="pl-10"
                aria-label="Search vault"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={cn(
                    "h-9 shrink-0 rounded-md px-3 text-sm",
                    kind === k ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
            {rows.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setOpen(d.id)}
                  className={cn(
                    "w-full rounded-lg px-3 py-3 text-left",
                    active?.id === d.id ? "bg-secondary" : "hover:bg-secondary/50",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{d.title}</span>
                  </span>
                  <span className="mt-1 block font-mono text-xs text-faint">
                    {d.kind} · {d.pages} pp · {d.updated}
                  </span>
                </button>
              </li>
            ))}
            {rows.length === 0 ? (
              <li className="px-3 py-8 text-sm text-muted-foreground">No documents in this slice.</li>
            ) : null}
          </ul>
        </section>
        <article className="hidden min-h-0 flex-1 overflow-y-auto p-6 md:block">
          {active ? (
            <div className="mx-auto max-w-xl">
              <h2 className="mt-3 font-display text-2xl font-medium tracking-tight">{active.title}</h2>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-faint">
                {active.kind} · {active.pages} pages · indexed {active.updated}
              </p>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{active.excerpt}</p>
              <p className="mt-6 rounded-lg border border-border bg-elevated p-4 text-sm leading-relaxed">
                Retrieval is dense + keyword over this corpus only. Embeddings live on 10.12.0.8.
                A query never constructs an HTTPS host outside the plant prefix.
              </p>
            </div>
          ) : null}
        </article>
      </div>
    </Shell>
  );
}
