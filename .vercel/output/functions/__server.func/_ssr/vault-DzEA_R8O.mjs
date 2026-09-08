import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Search, m as PencilLine, t as X, w as Download } from "../_libs/lucide-react.mjs";
import { i as cn, r as Shell, t as Button } from "./chrome-DBG2zFzu.mjs";
import { t as Badge } from "./badge-C05TCKcm.mjs";
import { u as VAULT } from "./data-BD_wHvxO.mjs";
import { t as downloadText } from "./download-DuRIImBz.mjs";
import { t as Textarea } from "./textarea-DVUUnBVb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vault-DzEA_R8O.js
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
var DEFAULT_DESCRIPTION = "Retrieval is dense + keyword over this corpus only. Embeddings live on 10.12.0.8. A query never constructs an HTTPS host outside the plant prefix.";
function VaultPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("All");
	const [open, setOpen] = (0, import_react.useState)(VAULT[0]?.id ?? "");
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const [draftTitle, setDraftTitle] = (0, import_react.useState)("");
	const [draftFileName, setDraftFileName] = (0, import_react.useState)("");
	const [draftDescription, setDraftDescription] = (0, import_react.useState)(DEFAULT_DESCRIPTION);
	const rows = (0, import_react.useMemo)(() => {
		return VAULT.filter((d) => {
			const hay = `${d.title} ${d.excerpt} ${d.kind}`.toLowerCase();
			const matchQ = q.trim() === "" || hay.includes(q.toLowerCase());
			const matchK = kind === "All" || d.kind === kind;
			return matchQ && matchK;
		});
	}, [q, kind]);
	const active = rows.find((r) => r.id === open) ?? rows[0];
	const activeDraft = active ? drafts[active.id] : void 0;
	const displayTitle = draftTitle || active?.title || "";
	const displayFileName = draftFileName || activeDraft?.fileName || (active ? `${active.title.replace(/[^\w.-]+/g, "_")}.pdf` : "");
	function loadEditorState(doc) {
		if (!doc) return;
		const saved = drafts[doc.id];
		setDraftTitle(saved?.title ?? doc.title);
		setDraftFileName(saved?.fileName ?? `${doc.title.replace(/[^\w.-]+/g, "_")}.pdf`);
		setDraftDescription(saved?.description ?? DEFAULT_DESCRIPTION);
	}
	(0, import_react.useEffect)(() => {
		loadEditorState(active);
		setEditing(false);
	}, [active?.id]);
	const handleDownload = () => {
		if (!active) return;
		downloadText(displayFileName, `${displayTitle}\n\n${active.kind} · ${active.pages} pages · indexed ${active.updated}\n\n${draftDescription}\n`, "text/plain");
	};
	function handleStartEdit() {
		loadEditorState(active);
		setEditing(true);
	}
	function handleCancelEdit() {
		loadEditorState(active);
		setEditing(false);
	}
	function handleSaveEdit() {
		if (!active) return;
		setDrafts((current) => ({
			...current,
			[active.id]: {
				title: draftTitle.trim() || active.title,
				fileName: draftFileName.trim() || `${active.title.replace(/[^\w.-]+/g, "_")}.pdf`,
				description: draftDescription.trim() || DEFAULT_DESCRIPTION
			}
		}));
		setEditing(false);
	}
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
					className: "mx-auto flex max-w-2xl flex-col gap-4 rounded-2xl border border-border bg-card/70 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: active.class === "Restricted" ? "warn" : "ok",
								children: active.class
							}), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									type: "button",
									onClick: handleCancelEdit,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), "Cancel"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									type: "button",
									onClick: handleSaveEdit,
									children: "Save"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								type: "button",
								onClick: handleStartEdit,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PencilLine, { className: "size-4" }), "Edit"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 text-right",
							children: [editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draftTitle,
								onChange: (e) => setDraftTitle(e.target.value),
								className: "h-11 text-right font-display text-2xl font-medium tracking-tight",
								"aria-label": "Edit title"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-medium tracking-tight",
								children: displayTitle
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs uppercase tracking-widest text-faint",
								children: [
									active.kind,
									" · ",
									active.pages,
									" pages · indexed ",
									active.updated
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl border border-border bg-background/70 px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draftFileName,
									onChange: (e) => setDraftFileName(e.target.value),
									className: "h-10",
									"aria-label": "Edit file name"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium text-foreground",
									children: displayFileName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-faint",
									children: "Local vault file"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "muted",
								size: "sm",
								className: "shrink-0",
								type: "button",
								onClick: handleDownload,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download"]
							})]
						}),
						editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] uppercase tracking-[0.2em] text-faint",
								children: "File description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: draftDescription,
								onChange: (e) => setDraftDescription(e.target.value),
								className: "min-h-32",
								"aria-label": "Edit file description"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-lg border border-border bg-elevated p-4 text-sm leading-relaxed text-foreground/90",
							children: draftDescription
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
