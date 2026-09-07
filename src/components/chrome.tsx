import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Cpu,
  FileStack,
  Menu,
  Radio,
  Shield,
  Terminal,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mark } from "@/components/mark";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Prototypes", icon: Shield },
  { to: "/workbench", label: "Workbench", icon: Terminal },
  { to: "/fleet", label: "Fleet", icon: Cpu },
  { to: "/vault", label: "Vault", icon: BookOpen },
  { to: "/proof", label: "Proof", icon: Radio },
  { to: "/studio", label: "Studio", icon: FileStack },
] as const;

function isActive(path: string, to: string) {
  if (to === "/") return path === "/";
  return path === to || path.startsWith(`${to}/`);
}

function useActivePath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

export function ClassTape() {
  const items = [
    "Internal",
    "Western Refinery Complex",
    "Air gap sealed",
    "10.12.0.0/16 only",
    "Egress denied",
    "Open-weight · on-prem",
  ];
  const line = [...items, ...items];
  return (
    <div className="relative flex h-8 items-center overflow-hidden border-b border-border bg-elevated">
      <div className="tape-marquee flex min-w-max items-center gap-8 px-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {line.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8">
            <span>{item}</span>
            <span className="text-faint" aria-hidden>
              /
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const path = useActivePath();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-3 backdrop-blur-sm md:px-5">
      <Link to="/" className="flex items-center gap-2.5 pr-2">
        <Mark className="size-6" />
        <span className="font-display text-sm font-semibold tracking-wide">Bastion</span>
      </Link>
      <Badge variant="ok" className="hidden sm:inline-flex">
        <span className="led-ok size-1.5 rounded-full bg-ok" />
        Sealed
      </Badge>
      <nav className="ml-4 hidden items-center gap-1 lg:flex">
        {NAV.map((item) => {
          const active = isActive(path, item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors duration-150",
                active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <span className="hidden font-mono text-xs text-faint md:inline">gpu-0 · 48 GB</span>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open ? (
        <div className="absolute inset-x-0 top-14 border-b border-border bg-card p-3 lg:hidden">
          <nav className="grid gap-1">
            {NAV.map((item) => {
              const active = isActive(path, item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-md px-3 text-sm",
                    active ? "bg-secondary text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function BottomNav() {
  const path = useActivePath();
  const items = NAV.filter((n) => n.to !== "/");
  return (
    <nav className="grid h-16 shrink-0 grid-cols-5 border-t border-border bg-card md:hidden">
      {items.map((item) => {
        const active = isActive(path, item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs tracking-wide",
              active ? "text-foreground" : "text-faint",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Shell({
  children,
  mode = "page",
}: {
  children: ReactNode;
  mode?: "page" | "app";
}) {
  return (
    <div
      className={cn(
        "flex flex-col bg-background text-foreground",
        mode === "app" ? "h-dvh overflow-hidden" : "min-h-dvh",
      )}
    >
      <ClassTape />
      <Header />
      <div className={cn("flex min-h-0 flex-1 flex-col", mode === "app" && "overflow-hidden")}>
        {children}
      </div>
      {mode === "app" ? <BottomNav /> : null}
    </div>
  );
}
