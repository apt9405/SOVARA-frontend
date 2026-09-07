import { Link } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  LoaderCircle,
  MessageSquareText,
  Paperclip,
  PaperclipIcon,
  Play,
  Plus,
  Presentation,
  Send,
  Terminal,
  UserRound,
  X,
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
type AttachmentItem = {
  id: string;
  name: string;
  size: number;
  type: string;
};
type ChatItem = {
  id: string;
  title: string;
  preview: string;
  status: "open" | "closed";
  messages: Msg[];
  plan: string[];
  planDone: boolean;
  route: { model: ModelId; reason: string } | null;
  tools: ToolRow[];
  artifacts: ArtifactId[];
  busy: boolean;
  draft: string;
  attachments: AttachmentItem[];
  activeDemo?: ScenarioId;
  runKey: number;
};

const ARTIFACT_ICON = {
  note: FileText,
  sheet: FileSpreadsheet,
  slides: Presentation,
  code: Terminal,
} as const;

function createChat(seed: Partial<ChatItem> & Pick<ChatItem, "id" | "title" | "preview">): ChatItem {
  return {
    status: "open",
    messages: [],
    plan: [],
    planDone: false,
    route: null,
    tools: [],
    artifacts: [],
    busy: false,
    draft: "",
    attachments: [],
    runKey: 0,
    ...seed,
  };
}

const INITIAL_CHATS: ChatItem[] = [
  createChat({
    id: "chat-1",
    title: "Inspection workflow",
    preview: "Scan review, routing, and punch list.",
    messages: [
      { id: "m-1", role: "user", text: "Review the last inspection scan and flag issues." },
      {
        id: "m-2",
        role: "assistant",
        text: "I routed it through vision, marked the anomalies, and drafted a clean punch list.",
      },
    ],
    plan: ["Inspect scan", "Route to vision model", "Draft punch list"],
    planDone: true,
    route: { model: MODELS[0].id, reason: "Best fit for image-based review and markup." },
    tools: [{ id: "t-1", name: "scan-parser", detail: "Loaded inspection pages and notes.", status: "ok" }],
  }),
  createChat({
    id: "chat-2",
    title: "Coding sandbox",
    preview: "Python task with local execution notes.",
    status: "closed",
    messages: [
      { id: "m-3", role: "user", text: "Run the sandbox routine for the heat balance check." },
      { id: "m-4", role: "assistant", text: "Completed locally and prepared the summary output." },
    ],
    plan: ["Parse code request", "Run local checks", "Summarize output"],
    planDone: true,
    route: { model: MODELS[1].id, reason: "Code and calculation requests map to the coder model." },
    tools: [{ id: "t-2", name: "python-runner", detail: "Executed local script and captured output.", status: "ok" }],
  }),
  createChat({
    id: "chat-3",
    title: "PID cleanup",
    preview: "P&ID markup and isolation validation.",
    messages: [
      { id: "m-5", role: "user", text: "Check the P&ID tags and isolation boundaries." },
      { id: "m-6", role: "assistant", text: "Marked the isolation path and verified the tag sequence." },
    ],
    plan: ["Review P&ID", "Trace isolation path", "Confirm boundaries"],
    planDone: true,
    route: { model: MODELS[0].id, reason: "Drawing interpretation is best handled by the vision route." },
    tools: [{ id: "t-3", name: "pid-tracer", detail: "Mapped valves and highlighted the isolation chain.", status: "ok" }],
  }),
];

const USER_PROFILE = {
  name: "Aarav Mehta",
  role: "Operations lead",
  org: "SOVARA Industrial Systems",
};

const EMPTY_MESSAGES: Msg[] = [];
const EMPTY_PLAN: string[] = [];
const EMPTY_TOOLS: ToolRow[] = [];
const EMPTY_ARTIFACTS: ArtifactId[] = [];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function WorkbenchPage({ demo }: { demo?: string }) {
  const initial = (["inspection", "coding", "pid"] as const).includes(demo as ScenarioId)
    ? (demo as ScenarioId)
    : undefined;

  const [chats, setChats] = useState<ChatItem[]>(() => [
    ...INITIAL_CHATS,
    createChat({
      id: "chat-current",
      title: "Current chat",
      preview: "Start a new conversation.",
      activeDemo: initial,
    }),
  ]);
  const [activeChatId, setActiveChatId] = useState("chat-current");
  const [mobilePane, setMobilePane] = useState<"chat" | "context">("chat");
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [reportExpanded, setReportExpanded] = useState(false); 
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? chats[0],
    [activeChatId, chats],
  );

  const messages = activeChat?.messages ?? EMPTY_MESSAGES;
  const plan = activeChat?.plan ?? EMPTY_PLAN;
  const planDone = activeChat?.planDone ?? false;
  const route = activeChat?.route ?? null;
  const tools = activeChat?.tools ?? EMPTY_TOOLS;
  const artifacts = activeChat?.artifacts ?? EMPTY_ARTIFACTS;
  const busy = activeChat?.busy ?? false;
  const draft = activeChat?.draft ?? "";
  const activeDemo = activeChat?.activeDemo;
  const runKey = activeChat?.runKey ?? 0;

  useEffect(() => {
    if (!activeDemo) return;
    const scenario = SCENARIOS.find((s) => s.id === activeDemo);
    if (!scenario) return;

    const timers: number[] = [];
    const apply = (ev: ScenarioEvent) => {
      if (ev.kind === "user") {
        setChats((current) =>
          current.map((chat) =>
            chat.id === activeChatId
              ? { ...chat, messages: [...chat.messages, { id: uid(), role: "user", text: ev.text }] }
              : chat,
          ),
        );
      } else if (ev.kind === "assistant") {
        setChats((current) =>
          current.map((chat) =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  messages: [...chat.messages, { id: uid(), role: "assistant", text: ev.text }],
                }
              : chat,
          ),
        );
      } else if (ev.kind === "route") {
        setChats((current) =>
          current.map((chat) =>
            chat.id === activeChatId ? { ...chat, route: { model: ev.model, reason: ev.reason } } : chat,
          ),
        );
      } else if (ev.kind === "plan") {
        setChats((current) =>
          current.map((chat) => (chat.id === activeChatId ? { ...chat, plan: ev.items } : chat)),
        );
      } else if (ev.kind === "tool") {
        setChats((current) =>
          current.map((chat) => {
            if (chat.id !== activeChatId) return chat;
            const existing = chat.tools.find((row) => row.name === ev.name);
            if (existing) {
              return {
                ...chat,
                tools: chat.tools.map((row) =>
                  row.name === ev.name ? { ...row, detail: ev.detail, status: ev.status } : row,
                ),
              };
            }
            return {
              ...chat,
              tools: [...chat.tools, { id: uid(), name: ev.name, detail: ev.detail, status: ev.status }],
            };
          }),
        );
      } else if (ev.kind === "artifact") {
        setChats((current) =>
          current.map((chat) =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  artifacts: chat.artifacts.includes(ev.id as ArtifactId)
                    ? chat.artifacts
                    : [...chat.artifacts, ev.id as ArtifactId],
                }
              : chat,
          ),
        );
      } else if (ev.kind === "done") {
        setChats((current) =>
          current.map((chat) =>
            chat.id === activeChatId ? { ...chat, planDone: true, busy: false, activeDemo: undefined } : chat,
          ),
        );
      }
    };

    for (const ev of scenario.events) {
      timers.push(window.setTimeout(() => apply(ev), ev.at));
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [activeChatId, activeDemo, runKey]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, tools, activeChatId]);

  const preview = useMemo(() => {
    if (activeDemo === "pid") return "pid";
    if (activeDemo === "inspection") return "scan";
    if (activeDemo === "coding") return "code";
    return null;
  }, [activeDemo]);

  function start(id: ScenarioId, options?: { keepMessages?: boolean }) {
    setChats((current) =>
      current.map((chat) => {
        if (chat.id !== activeChatId) return chat;
        return {
          ...chat,
          activeDemo: id,
          runKey: chat.runKey + 1,
          busy: true,
          plan: [],
          planDone: false,
          route: null,
          tools: [],
          artifacts: [],
          draft: "",
          attachments: [],
          messages: options?.keepMessages ? chat.messages : [],
        };
      }),
    );
  }

  function createNewChat() {
    const id = `chat-${uid()}`;
    setChats((current) => [
      createChat({
        id,
        title: "New chat",
        preview: "Fresh conversation.",
      }),
      ...current,
    ]);
    setActiveChatId(id);
    setMobilePane("chat");
  }

  function activateChat(chatId: string) {
    setActiveChatId(chatId);
    setMobilePane("chat");
  }

  function closeChat(chatId: string) {
    setChats((current) =>
      current.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              status: "closed",
            }
          : chat,
      ),
    );
  }

  function openChat(chatId: string) {
    setChats((current) =>
      current.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              status: "open",
            }
          : chat,
      ),
    );
    setActiveChatId(chatId);
    setMobilePane("chat");
  }

  function handleAttachments(files: FileList | null) {
    if (!files?.length) return;
    const nextAttachments = Array.from(files).map((file) => ({
      id: uid(),
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setChats((current) =>
      current.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, attachments: [...chat.attachments, ...nextAttachments] }
          : chat,
      ),
    );
  }

  function onSend() {
    const text = draft.trim();
    if (!text && activeChat.attachments.length === 0) return;
    if (busy) return;

    const lower = text.toLowerCase();
    if (lower.includes("p-101") || lower.includes("p&id") || lower.includes("isolat")) {
      start("pid");
    } else if (lower.includes("python") || lower.includes("lmtd") || lower.includes("code") || lower.includes("sandbox")) {
      start("coding");
    } else {
      start("inspection");
    }

    setChats((current) =>
      current.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              draft: "",
              attachments: [],
            }
          : chat,
      ),
    );
    setDraft("");
  }

  function updateDraft(value: string) {
    setChats((current) =>
      current.map((chat) => (chat.id === activeChatId ? { ...chat, draft: value } : chat)),
    );
    setDraft(value);
  }

  const model = route ? modelById(route.model) : MODELS[2];
  const openChats = chats.filter((chat) => chat.status === "open");
  const closedChats = chats.filter((chat) => chat.status === "closed");

  return (
    <Shell mode="app">
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card xl:flex">
          <div className="border-b border-border p-3">
            <Button type="button"  className="h-8 w-fyll justify-start gap-1 rounded-md  bg-trans text-left text-white " onClick={createNewChat}>
              <Plus className="size-5" />
              New chat
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <section className="border-b border-border px-3 py-3">
              <Button 
              type="button"
              aria-expanded={recentExpanded}
              onClick={() => setRecentExpanded((expanded) => !expanded)}
              className="h-8 w-full justify-start gap-1 rounded-md  bg-trans text-left text-white " >
                <MessageSquareText className="size-3.5 text-primary" />
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] ">Recents</p>
              </Button>

              {recentExpanded ? (
              <div className="mt-2 space-y-1">
                {openChats.length > 0 ? (
                  openChats.map((chat) => {
                    const active = chat.id === activeChatId;
                    return (
                      <div
                        key={chat.id}
                        className={cn(
                          "flex items-start gap-2 rounded-lg px-2.5 py-2 transition-colors duration-150",
                          active ? "bg-secondary" : "hover:bg-secondary/60",
                        )}
                      >
                        <button type="button" className="min-w-0 flex-1 text-left" onClick={() => activateChat(chat.id)}>
                          <span className="block truncate text-[13px] font-medium leading-tight">{chat.title}</span>
                          <span className="mt-0.5 block truncate text-[11px] leading-snug text-muted-foreground">
                            {chat.preview}
                          </span>
                        </button>
                        <button
                          type="button"
                          aria-label={`Close ${chat.title}`}
                          className="mt-0.5 rounded-md p-1 text-faint transition-colors hover:bg-background hover:text-foreground"
                          onClick={() => closeChat(chat.id)}
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="px-1 text-[12px] text-muted-foreground">No open chats yet.</p>
                )}
              </div>
              ) : null}
            </section>

            {/* {closedChats.length > 0 ? (
              <section className="border-b border-border px-3 py-3">
                <div className="flex items-center gap-2 px-1">
                  <MessageSquareText className="size-3.5 text-primary" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-faint">Closed chats</p>
                </div>
                <div className="mt-2 space-y-1">
                  {closedChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="flex items-start gap-2 rounded-lg px-2.5 py-2 transition-colors duration-150 hover:bg-secondary/60"
                    >
                      <button type="button" className="min-w-0 flex-1 text-left" onClick={() => openChat(chat.id)}>
                        <span className="block truncate text-[13px] font-medium leading-tight">{chat.title}</span>
                        <span className="mt-0.5 block truncate text-[11px] leading-snug text-muted-foreground">
                          {chat.preview}
                        </span>
                      </button>
                      <Button
                        type="button"
                        size="sm"
                        variant="muted"
                        className="h-7 px-2 text-[11px]"
                        onClick={() => openChat(chat.id)}
                      >
                        Open
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <nav className="flex flex-col gap-1 p-2">
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
            </nav> */}

            <section className="border-t border-border px-3 py-3">
              <Button className="h-8 w-full justify-start gap-1 rounded-md  bg-trans text-left text-white">
                <FolderKanban className="size-4 text-primary" />
                <p className="font-mono text-xs uppercase tracking-widest ">Artifacts</p>
              </Button>
              <div className="mt-3 space-y-2">
                {artifacts.length > 0 ? (
                  artifacts.map((id) => {
                    const d = DELIVERABLES.find((x) => x.id === id);
                    if (!d) return null;
                    const Icon = ARTIFACT_ICON[d.kind];
                    return (
                      <Link
                        key={id}
                        to="/studio"
                        className="flex h-11 items-center gap-2 rounded-md px-2 text-sm hover:bg-secondary"
                      >
                        <Icon className="size-4 text-primary" />
                        {d.name}
                      </Link>
                    );
                  })
                ) : (
                  <p className="px-1 text-sm text-muted-foreground">Artifacts will appear here.</p>
                )}
              </div>
            </section>
          </div>
          <div className="group relative border-t border-border p-3">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-1 py-1.5 text-left transition-colors duration-150 hover:bg-secondary/50 focus-visible:bg-secondary/50"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-faint">Loaded weights</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Hover</span>
            </button>
            <div className="pointer-events-none absolute inset-x-3 bottom-full z-20 mb-2 hidden group-hover:block group-focus-within:block">
              <div className="rounded-xl border border-border bg-card/98 p-3 shadow-2xl shadow-black/40 backdrop-blur-md">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-faint">Loaded weights</p>
                <ul className="mt-2 space-y-1">
                  {MODELS.filter((m) => m.loaded).map((m) => (
                    <li key={m.id} className="flex items-center justify-between text-[11px]">
                      <span>{m.name}</span>
                      <span className="size-1.5 rounded-full bg-ok" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="group relative border-t border-border p-3">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-1 py-1.5 text-left transition-colors duration-150 hover:bg-secondary/50 focus-visible:bg-secondary/50"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-faint">{USER_PROFILE.name}</span>
            </button>
            <div className="pointer-events-none absolute inset-x-3 bottom-full z-20 mb-2 hidden group-hover:block group-focus-within:block">
              <div className="rounded-xl border border-border bg-card/98 p-3 shadow-2xl shadow-black/40 backdrop-blur-md">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <UserRound className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{USER_PROFILE.name}</p>
                    <p className="text-xs text-muted-foreground">{USER_PROFILE.role}</p>
                    <p className="mt-1 text-xs text-faint">{USER_PROFILE.org}</p>
                  </div>
                </div>
              </div>
            </div>
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
                          <span className="text-muted-foreground"> - {route.reason}</span>
                        </p>
                      </div>
                    ) : null}
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "max-w-[92%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed break-words",
                          message.role === "user"
                            ? "self-end rounded-br-sm bg-secondary"
                            : "self-start rounded-bl-sm border border-border",
                        )}
                      >
                        {message.text}
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
                  {activeChat.attachments.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {activeChat.attachments.map((attachment) => (
                        <span
                          key={attachment.id}
                          className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1 text-xs text-muted-foreground"
                        >
                          <Paperclip className="size-3.5" />
                          <span className="max-w-[12rem] truncate">{attachment.name}</span>
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
                    {SCENARIOS.map((s) => (
                      <Button key={s.id} type="button" size="sm" variant="muted" onClick={() => start(s.id)}>
                        <Play />
                        {s.title}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-end gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        handleAttachments(e.target.files);
                        e.currentTarget.value = "";
                      }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="muted"
                      aria-label="Attach file"
                      className="h-12 w-12 shrink-0 rounded-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <PaperclipIcon />
                    </Button>
                    <Textarea
                      value={draft}
                      onChange={(e) => updateDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          onSend();
                        }
                      }}
                      placeholder="Task the agent - scans, code, P&IDs, notes"
                      className=" min-h-12 resize-none"
                      rows={2}
                    />
                    <Button size="icon" aria-label="Send" className="h-12 w-12 shrink-0 rounded-full" disabled={busy} onClick={onSend}>
                      <Send />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div>
            
              
            <Button
            type="button"
            aria-expanded={reportExpanded}
            onClick={() => setReportExpanded((expanded) => !expanded)}
             className="h-8 w-full justify-start rounded-md bg-transparent text-left text-white"
             >
              Report
             </Button>

             {reportExpanded ? (
              <ContextRail
                plan={plan}
                planDone={planDone}
                tools={tools}
                artifacts={artifacts}
                preview={preview}
                reason={route?.reason}
              />
             ) : null}
            
            </div>
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
