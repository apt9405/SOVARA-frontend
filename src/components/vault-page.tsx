import { Download, PencilLine, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VAULT, type VaultDoc } from "@/lib/data";
import { downloadText } from "@/lib/download";
import { cn } from "@/lib/utils";

const KINDS = ["All", "SOP", "Standard", "Manual", "Drawing", "Template", "Mail"] as const;
const DEFAULT_DESCRIPTION =
  "Retrieval is dense + keyword over this corpus only. Embeddings live on 10.12.0.8. A query never constructs an HTTPS host outside the plant prefix.";

type VaultDraft = {
  title: string;
  description: string;
};

function formatUploadedDate(value: string) {
  const [year, month] = value.split("-").map((part) => Number.parseInt(part, 10));
  if (!year || !month) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

export function VaultPage() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("All");
  const [docs, setDocs] = useState<VaultDoc[]>(() => VAULT);
  const [open, setOpen] = useState<string>(VAULT[0]?.id ?? "");
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, VaultDraft>>({});
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDescription, setDraftDescription] = useState(DEFAULT_DESCRIPTION);

  const rows = useMemo(() => {
    return docs.filter((d) => {
      const hay = `${d.title} ${d.excerpt} ${d.kind}`.toLowerCase();
      const matchQ = q.trim() === "" || hay.includes(q.toLowerCase());
      const matchK = kind === "All" || d.kind === kind;
      return matchQ && matchK;
    });
  }, [q, kind, docs]);

  const active: VaultDoc | undefined = rows.find((r) => r.id === open) ?? rows[0];
  const saved = active ? drafts[active.id] : undefined;
  const displayTitle = saved?.title ?? active?.title ?? "";
  const displayDescription = saved?.description ?? DEFAULT_DESCRIPTION;
  const displayFileName = active ? `${active.title.replace(/[^\w.-]+/g, "_")}.pdf` : "";

  useEffect(() => {
    if (!active) return;
    const next = drafts[active.id];
    setDraftTitle(next?.title ?? active.title);
    setDraftDescription(next?.description ?? DEFAULT_DESCRIPTION);
    setEditing(false);
  }, [active?.id, drafts]);

  const handleDownload = () => {
    if (!active) return;
    downloadText(
      displayFileName,
      `${displayTitle}\n\n${active.pages} pages · uploaded on ${formatUploadedDate(active.uploaded)}\n\n${displayDescription}\n`,
      "text/plain",
    );
  };

  const handleStartEdit = () => {
    if (!active) return;
    setDraftTitle(saved?.title ?? active.title);
    setDraftDescription(saved?.description ?? DEFAULT_DESCRIPTION);
    setEditing(true);
  };

  const handleCancelEdit = () => {
    if (!active) return;
    setDraftTitle(saved?.title ?? active.title);
    setDraftDescription(saved?.description ?? DEFAULT_DESCRIPTION);
    setEditing(false);
  };

  const handleSaveEdit = () => {
    if (!active) return;
    setDrafts((current) => ({
      ...current,
      [active.id]: {
        title: draftTitle.trim() || active.title,
        description: draftDescription.trim() || DEFAULT_DESCRIPTION,
      },
    }));
    setEditing(false);
  };

  const handleDelete = () => {
    if (!active) return;
    const nextDocs = docs.filter((doc) => doc.id !== active.id);
    setDocs(nextDocs);
    setOpen(nextDocs[0]?.id ?? "");
    setEditing(false);
  };

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
                    <Badge variant={d.class === "Restricted" ? "warn" : "default"}>{d.class}</Badge>
                  </span>
                  <span className="mt-1 block font-mono text-xs text-faint">
                    {d.pages} pages · uploaded on {formatUploadedDate(d.uploaded)}
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
              <div className="flex items-start justify-between gap-3">
                <Badge variant={active.class === "Restricted" ? "warn" : "ok"}>{active.class}</Badge>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" type="button" onClick={handleCancelEdit}>
                      <X className="size-4" />
                      Cancel
                    </Button>
                    <Button variant="outline" size="sm" type="button" onClick={handleSaveEdit}>
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="shrink-0" type="button" onClick={handleStartEdit}>
                    <PencilLine className="size-4" />
                    Edit
                  </Button>
                )}
              </div>

              <div className="mt-3 space-y-2">
                {editing ? (
                  <Input
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="h-11 font-display text-2xl font-medium tracking-tight"
                    aria-label="Edit title"
                  />
                ) : (
                  <h2 className="font-display text-2xl font-medium tracking-tight">{displayTitle}</h2>
                )}
                <p className="font-mono text-xs uppercase tracking-widest text-faint">
                  {active.pages} pages · uploaded on {formatUploadedDate(active.uploaded)}
                </p>
              </div>

              <div className="mt-6 rounded-xl border border-border bg-background/70 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{displayFileName}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
                      Local vault file
                    </p>
                  </div>
                  <Button variant="muted" size="sm" className="shrink-0" type="button" onClick={handleDownload}>
                    <Download className="size-4" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">File description</p>
                {editing ? (
                  <Textarea
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                    className="min-h-32"
                    aria-label="Edit file description"
                  />
                ) : (
                  <p className="rounded-lg border border-border bg-elevated p-4 text-sm leading-relaxed text-foreground/90">
                    {displayDescription}
                  </p>
                )}
              </div>

              {editing ? (
                <div className="mt-4">
                  <Button
                    size="sm"
                    type="button"
                    onClick={handleDelete}
                    className="border border-border bg-destructive/10 text-crit hover:bg-destructive/15"
                  >
                    Delete file
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </article>
      </div>
    </Shell>
  );
}
