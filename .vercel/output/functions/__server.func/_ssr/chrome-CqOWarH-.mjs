import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime, d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Shield, m as Menu, r as Terminal, t as X, u as Radio, v as FileStack, w as BookOpen, x as Cpu } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chrome-CqOWarH-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var badgeVariants = cva("inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-xs font-medium tracking-wide uppercase", {
	variants: { variant: {
		default: "border-border bg-secondary text-muted-foreground",
		ok: "border-ok/30 bg-ok/10 text-ok",
		warn: "border-warn/30 bg-warn/10 text-warn",
		crit: "border-crit/30 bg-crit/10 text-crit",
		solid: "border-transparent bg-primary text-primary-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			outline: "border border-border bg-transparent text-foreground hover:bg-secondary",
			ghost: "text-foreground hover:bg-secondary",
			muted: "bg-secondary text-foreground hover:bg-accent",
			ok: "bg-ok text-ok-foreground hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-sm",
			lg: "h-12 px-5",
			icon: "size-11",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: cn("text-primary", className),
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 2.5 L20.5 6 v7.2 c0 5.2-8.5 10.3-8.5 10.3S3.5 18.4 3.5 13.2 V6 Z",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.4",
				strokeLinejoin: "miter"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 8 v8",
				stroke: "currentColor",
				strokeWidth: "1.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M8.5 12.2 h7",
				stroke: "currentColor",
				strokeWidth: "1.4"
			})
		]
	});
}
var NAV = [
	{
		to: "/",
		label: "Prototypes",
		icon: Shield
	},
	{
		to: "/workbench",
		label: "Workbench",
		icon: Terminal
	},
	{
		to: "/fleet",
		label: "Fleet",
		icon: Cpu
	},
	{
		to: "/vault",
		label: "Vault",
		icon: BookOpen
	},
	{
		to: "/proof",
		label: "Proof",
		icon: Radio
	},
	{
		to: "/studio",
		label: "Studio",
		icon: FileStack
	}
];
function isActive(path, to) {
	if (to === "/") return path === "/";
	return path === to || path.startsWith(`${to}/`);
}
function useActivePath() {
	return useRouterState({ select: (s) => s.location.pathname });
}
function ClassTape() {
	const items = [
		"Internal",
		"Western Refinery Complex",
		"Air gap sealed",
		"10.12.0.0/16 only",
		"Egress denied",
		"Open-weight · on-prem"
	];
	const line = [...items, ...items];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative flex h-8 items-center overflow-hidden border-b border-border bg-elevated",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tape-marquee flex min-w-max items-center gap-8 px-4 font-mono text-xs uppercase tracking-widest text-muted-foreground",
			children: line.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-faint",
					"aria-hidden": true,
					children: "/"
				})]
			}, `${item}-${i}`))
		})
	});
}
function Header() {
	const path = useActivePath();
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "relative z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-3 backdrop-blur-sm md:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2.5 pr-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-sm font-semibold tracking-wide",
					children: "Bastion"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "ok",
				className: "hidden sm:inline-flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "led-ok size-1.5 rounded-full bg-ok" }), "Sealed"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "ml-4 hidden items-center gap-1 lg:flex",
				children: NAV.map((item) => {
					const active = isActive(path, item.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: cn("rounded-md px-3 py-2 text-sm transition-colors duration-150", active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"),
						children: item.label
					}, item.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden font-mono text-xs text-faint md:inline",
					children: "gpu-0 · 48 GB"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "lg:hidden",
					"aria-label": open ? "Close menu" : "Open menu",
					onClick: () => setOpen((v) => !v),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
				})]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-x-0 top-14 border-b border-border bg-card p-3 lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "grid gap-1",
					children: NAV.map((item) => {
						const active = isActive(path, item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							onClick: () => setOpen(false),
							className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm", active ? "bg-secondary text-foreground" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
						}, item.to);
					})
				})
			}) : null
		]
	});
}
function BottomNav() {
	const path = useActivePath();
	const items = NAV.filter((n) => n.to !== "/");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "grid h-16 shrink-0 grid-cols-5 border-t border-border bg-card md:hidden",
		children: items.map((item) => {
			const active = isActive(path, item.to);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				className: cn("flex flex-col items-center justify-center gap-1 text-xs tracking-wide", active ? "text-foreground" : "text-faint"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
			}, item.to);
		})
	});
}
function Shell({ children, mode = "page" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col bg-background text-foreground", mode === "app" ? "h-dvh overflow-hidden" : "min-h-dvh"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassTape, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("flex min-h-0 flex-1 flex-col", mode === "app" && "overflow-hidden"),
				children
			}),
			mode === "app" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {}) : null
		]
	});
}
//#endregion
export { cn as a, Shell as i, Button as n, Mark as r, Badge as t };
