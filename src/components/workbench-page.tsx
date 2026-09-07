import { Link } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  LoaderCircle,
  Paperclip,
  Play,
  Presentation,
  Send,
  Terminal,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Shell } from "@/components/chrome";
import { Crop } from "@/components/crop";
import { PidDrawing, ScanDocument } from "@/components/artifacts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  type ModelId,
  type ScenarioEvent,
  type ScenarioId,
  DELIVERABLES,
  MODELS,
  SCENARIOS,
  modelById,
} from "@/lib/data";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "user" | "assistant"; text: string };
type ToolRow = { id: string; name: string; detail: string; status: "run" | "ok" };
type ArtifactId = (typeof DELIVERABLES)[number]["id"];

const ARTIFACT_ICON = {
  note: FileText,
  sheet: FileSpreadsheet,
  slides: Presentation,
  code: Terminal,
} as const;

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function WorkbenchPage({ demo }: { demo?: string }) {
  const initial = (["inspection", "coding", "pid"] as const).includes(demo as ScenarioId)
    ? (demo as ScenarioId)
    : undefined;

  const [runKey, setRunKey] = useState(0);
  const [activeDemo, setActiveDemo] = useState<ScenarioId | undefined>(initial);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [plan, setPlan] = useState<string[]>([]);
  const [planDone, setPlanDone] = useState(false);
  const [route, setRoute] = useState<{ model: ModelId; reason: string } | null>(null);
  const [tools, setTools] = useState<ToolRow[]>([]);
  const [artifacts, setArtifacts] = useState<ArtifactId[]>([]);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [mobilePane, setMobilePane] = useState<"chat" | "context">("chat");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeDemo) return;
    const scenario = SCENARIOS.find((s) => s.id === activeDemo);
    if (!scenario) return;

    setMessages([]);
    setPlan([]);
    setPlanDone(false);
    setRoute(null);
    setTools([]);
    setArtifacts([]);
    setBusy(true);
    setMobilePane("chat");

    const timers: number[] = [];
    const apply = (ev: ScenarioEvent) => {
      if (ev.kind === "user") {
        setMessages((m) => [...m, { id: uid(), role: "user", text: ev.text }]);
      } else if (ev.kind === "assistant") {
        setMessages((m) => [...m, { id: uid(), role: "assistant", text: ev.text }]);
      } else if (ev.kind === "route") {
        setRoute({ model: ev.model, reason: ev.reason });
      } else if (ev.kind === "plan") {
        setPlan(ev.items);
      } else if (ev.kind === "tool") {
        setTools((rows) => {
          const existing = rows.find((r) => r.name === ev.name);
          if (existing) {
            return rows.map((r) =>
              r.name === ev.name ? { ...r, detail: ev.detail, status: ev.status } : r,
            );
          }
          return [...rows, { id: uid(), name: ev.name, detail: ev.detail, status: ev.status }];
        });
      } else if (ev.kind === "artifact") {
        setArtifacts((a) => (a.includes(ev.id as ArtifactId) ? a : [...a, ev.id as ArtifactId]));
      } else if (ev.kind === "done") {
        setPlanDone(true);
        setBusy(false);
      }
    };

    for (const ev of scenario.events) {
      timers.push(window.setTimeout(() => apply(ev), ev.at));
    }

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [activeDemo, runKey]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, tools]);

  const preview = useMemo(() => {
    if (activeDemo === "pid") return "pid";
    if (activeDemo === "inspection") return "scan";
    if (activeDemo === "coding") return "code";
    return null;
  }, [activeDemo]);

  function start(id: ScenarioId) {
    setActiveDemo(id);
    setRunKey((k) => k + 1);
  }

  function onSend() {
    const text = draft.trim();
    if (!text || busy) return;
    const lower = text.toLowerCase();
    if (lower.includes("p-101") || lower.includes("p&id") || lower.includes("isolat")) {
      start("pid");
    } else if (lower.includes("python") || lower.includes("lmtd") || lower.includes("code") || lower.includes("sandbox")) {
      start("coding");
    } else {
      start("inspection");
    }
    setDraft("");
  }

  const model = route ? modelById(route.model) : MODELS[2];

  return (
    <Shell mode="app">
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card xl:flex">
          <div className="border-b border-border px-4 py-3">
            
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => start(s.id)}
                className={cn(
                  "rounded-md px-3 py-3 text-left transition-colors duration-150",
                  activeDemo === s.id ? "bg-secondary" : "hover:bg-secondary/60",
                )}
              >
                <span className="block text-sm font-medium">{s.title}</span>
                <span className="mt-0.5 block font-mono text-xs uppercase tracking-wider text-faint">
                  {s.taskType}
                </span>
              </button>
            ))}
          </nav>
          <div className="border-t border-border p-3">
            <p className="font-mono text-xs uppercase tracking-widest text-faint">Loaded weights</p>
            <ul className="mt-2 space-y-1">
              {MODELS.filter((m) => m.loaded).map((m) => (
                <li key={m.id} className="flex items-center justify-between text-xs">
                  <span>{m.name}</span>
                  <span className="size-1.5 rounded-full bg-ok" />
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2 md:px-4">
            <p className="text-sm font-medium">Agent</p>
            <Badge variant="ok" className="hidden sm:inline-flex">
              {model.name}
            </Badge>
            <div className="ml-auto flex rounded-md bg-secondary p-0.5 lg:hidden">
              <button
                type="button"
                className={cn(
                  "h-9 rounded-sm px-3 text-sm",
                  mobilePane === "chat" ? "bg-card text-foreground" : "text-muted-foreground",
                )}
                onClick={() => setMobilePane("chat")}
              >
                Thread
              </button>
              <button
                type="button"
                className={cn(
                  "h-9 rounded-sm px-3 text-sm",
                  mobilePane === "context" ? "bg-card text-foreground" : "text-muted-foreground",
                )}
                onClick={() => setMobilePane("context")}
              >
                Context
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1">
            <div
              className={cn(
                "min-w-0 flex-1 flex-col",
                mobilePane === "chat" ? "flex" : "hidden lg:flex",
              )}
            >
              <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-6">
                {messages.length === 0 && !busy ? (
                  <EmptyState onPick={start} />
                ) : (
                  <div className="mx-auto flex max-w-2xl flex-col gap-4">
                    {route ? (
                      <div className="rounded-lg border border-border bg-elevated px-3 py-2 text-sm">
                        <p className="font-mono text-xs uppercase tracking-widest text-ok">Router</p>
                        <p className="mt-1">
                          <span className="font-medium">{model.name}</span>
                          <span className="text-muted-foreground"> — {route.reason}</span>
                        </p>
                      </div>
                    ) : null}
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={cn(
                          "max-w-[92%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed break-words",
                          m.role === "user"
                            ? "self-end rounded-br-sm bg-secondary"
                            : "self-start rounded-bl-sm border border-border",
                        )}
                      >
                        {m.text}
                      </div>
                    ))}
                    {busy ? (
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <LoaderCircle className="size-4 animate-spin" />
                        Working on premises
                      </p>
                    ) : null}
                    <div ref={endRef} />
                  </div>
                )}
              </div>

              <div className="border-t border-border p-3 md:p-4">
                <div className="mx-auto flex max-w-2xl flex-col gap-2">
                  <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
                    {SCENARIOS.map((s) => (
                      <Button key={s.id} type="button" size="sm" variant="muted" onClick={() => start(s.id)}>
                        <Play />
                        {s.title}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-end gap-2">
                    <Textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          onSend();
                        }
                      }}
                      placeholder="Task the agent — scans, code, P&IDs, notes"
                      className="min-h-12 resize-none"
                      rows={2}
                    />
                    <Button
                      size="icon"
                      aria-label="Send"
                      disabled={busy}
                      onClick={onSend}
                    >
                      <Send />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <aside
              className={cn(
                "min-h-0 w-full shrink-0 flex-col overflow-y-auto border-border bg-card lg:flex lg:w-80 lg:border-l",
                mobilePane === "context" ? "flex" : "hidden",
              )}
            >
              <ContextRail
                plan={plan}
                planDone={planDone}
                tools={tools}
                artifacts={artifacts}
                preview={preview}
                reason={route?.reason}
              />
            </aside>
          </div>
        </section>
      </div>
    </Shell>
  );
}

function EmptyState({ onPick }: { onPick: (id: ScenarioId) => void }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 py-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ok">On-prem agent</p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-tight md:text-3xl">
          Three task types. Two models at a time. Nothing leaves.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Pick a scenario or type a task. The router will choose vision, coder, or instruct weights on this GPU.
        </p>
      </div>
      <div className="grid gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s.id)}
            className="flex items-start gap-3 rounded-lg border border-border bg-elevated p-4 text-left transition-colors duration-150 hover:border-foreground/25"
          >
            <Play className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              <span className="block text-sm font-medium">{s.title}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{s.blurb}</span>
            </span>
            <ChevronRight className="ml-auto size-4 shrink-0 text-faint" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ContextRail({
  plan,
  planDone,
  tools,
  artifacts,
  preview,
  reason,
}: {
  plan: string[];
  planDone: boolean;
  tools: ToolRow[];
  artifacts: ArtifactId[];
  preview: "scan" | "pid" | "code" | null;
  reason?: string;
}) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <section>
        <p className="font-mono text-xs uppercase tracking-widest text-faint">Plan</p>
        {plan.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Waiting for a task.</p>
        ) : (
          <ol className="mt-2 space-y-1.5">
            {plan.map((step, i) => (
              <li key={step} className="flex items-start gap-2 text-sm">
                {planDone || artifacts.length > 0 || i < tools.filter((t) => t.status === "ok").length ? (
                  <Check className="mt-0.5 size-3.5 shrink-0 text-ok" />
                ) : (
                  <span className="mt-1 size-3.5 shrink-0 rounded-full border border-border" />
                )}
                {step}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <p className="font-mono text-xs uppercase tracking-widest text-faint">Tools</p>
        {tools.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No local calls yet.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {tools.map((t) => (
              <li key={t.id} className="rounded-md border border-border px-2.5 py-2">
                <p className="flex items-center justify-between font-mono text-xs">
                  {t.name}
                  <Badge variant={t.status === "ok" ? "ok" : "warn"}>{t.status}</Badge>
                </p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{t.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {reason ? (
        <section>
          <p className="font-mono text-xs uppercase tracking-widest text-faint">Why this model</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{reason}</p>
        </section>
      ) : null}

      <section>
        <p className="font-mono text-xs uppercase tracking-widest text-faint">Artifact</p>
        <div className="mt-2">
          {preview === "scan" ? <ScanDocument /> : null}
          {preview === "pid" ? <PidDrawing /> : null}
          {preview === "code" ? (
            <Crop className="rounded-md bg-elevated p-3 font-mono text-xs leading-relaxed text-muted-foreground">
              <p className="text-ok">sandbox · egress 0</p>
              <p className="mt-1">4 passed in 0.08s</p>
              <p>Q = 4.82 MW · LMTD 18.4 °C</p>
            </Crop>
          ) : null}
          {!preview ? (
            <p className="text-sm text-muted-foreground">Attach a scan, drawing, or data file.</p>
          ) : null}
        </div>
      </section>

      {artifacts.length > 0 ? (
        <section>
          <p className="font-mono text-xs uppercase tracking-widest text-faint">On the bench</p>
          <ul className="mt-2 space-y-1">
            {artifacts.map((id) => {
              const d = DELIVERABLES.find((x) => x.id === id);
              if (!d) return null;
              const Icon = ARTIFACT_ICON[d.kind];
              return (
                <li key={id}>
                  <Link
                    to="/studio"
                    className="flex h-11 items-center gap-2 rounded-md px-2 text-sm hover:bg-secondary"
                  >
                    <Icon className="size-4 text-primary" />
                    {d.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <p className="flex items-center gap-2 text-xs text-faint">
          <Paperclip className="size-3.5" />
          Files stay in the vault
        </p>
      )}
    </div>
  );
}
