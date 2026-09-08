import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime, d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as FileStack, E as Cpu, a as Terminal, d as Radio, k as BookOpen, t as X, v as Menu } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chrome-DBG2zFzu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
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
	return path === to || path.startsWith(`${to}/`);
}
function useActivePath() {
	return useRouterState({ select: (s) => s.location.pathname });
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
					children: "SOVARA"
				})]
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ml-auto flex items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "lg:hidden",
					"aria-label": open ? "Close menu" : "Open menu",
					onClick: () => setOpen((v) => !v),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
				})
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "grid h-16 shrink-0 grid-cols-5 border-t border-border bg-card md:hidden",
		children: NAV.map((item) => {
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
export { cn as i, Mark as n, Shell as r, Button as t };
