import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as Search } from "../_libs/lucide-react.mjs";
import { i as cn, r as Shell } from "./chrome-C9eRfZ3j.mjs";
import { t as Badge } from "./badge-Bq4bhf_B.mjs";
import { u as VAULT } from "./data-BD_wHvxO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vault-BNRWuMbp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm text-foreground placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var KINDS = [
	"All",
	"SOP",
	"Standard",
	"Manual",
	"Drawing",
	"Template",
	"Mail"
];
function VaultPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("All");
	const [open, setOpen] = (0, import_react.useState)(VAULT[0]?.id ?? "");
	const rows = (0, import_react.useMemo)(() => {
		return VAULT.filter((d) => {
			const hay = `${d.title} ${d.excerpt} ${d.kind}`.toLowerCase();
			const matchQ = q.trim() === "" || hay.includes(q.toLowerCase());
			const matchK = kind === "All" || d.kind === kind;
			return matchQ && matchK;
		});
	}, [q, kind]);
	const active = rows.find((r) => r.id === open) ?? rows[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		mode: "app",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col md:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex min-h-0 w-full flex-col border-border md:w-96 md:border-r lg:w-[28rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-widest text-ok",
							children: "Knowledge vault"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-medium tracking-tight",
							children: "Manuals, SOPs, mail."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search the local index",
								className: "pl-10",
								"aria-label": "Search vault"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1 overflow-x-auto pb-1",
							children: KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setKind(k),
								className: cn("h-9 shrink-0 rounded-md px-3 text-sm", kind === k ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"),
								children: k
							}, k))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "min-h-0 flex-1 overflow-y-auto px-2 pb-4",
					children: [rows.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOpen(d.id),
						className: cn("w-full rounded-lg px-3 py-3 text-left", active?.id === d.id ? "bg-secondary" : "hover:bg-secondary/50"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: d.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: d.class === "Restricted" ? "warn" : "default",
								children: d.class
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block font-mono text-xs text-faint",
							children: [
								d.kind,
								" · ",
								d.pages,
								" pp · ",
								d.updated
							]
						})]
					}) }, d.id)), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-3 py-8 text-sm text-muted-foreground",
						children: "No documents in this slice."
					}) : null]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
				className: "hidden min-h-0 flex-1 overflow-y-auto p-6 md:block",
				children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: active.class === "Restricted" ? "warn" : "ok",
							children: active.class
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-2xl font-medium tracking-tight",
							children: active.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-xs uppercase tracking-widest text-faint",
							children: [
								active.kind,
								" · ",
								active.pages,
								" pages · indexed ",
								active.updated
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-sm leading-relaxed text-muted-foreground",
							children: active.excerpt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 rounded-lg border border-border bg-elevated p-4 text-sm leading-relaxed",
							children: "Retrieval is dense + keyword over this corpus only. Embeddings live on 10.12.0.8. A query never constructs an HTTPS host outside the plant prefix."
						})
					]
				}) : null
			})]
		})
	});
}
var SplitComponent = VaultPage;
//#endregion
export { SplitComponent as component };
