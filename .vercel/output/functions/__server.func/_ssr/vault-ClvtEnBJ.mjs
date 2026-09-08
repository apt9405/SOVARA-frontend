import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as Download, h as PencilLine, l as Search, p as Plus, r as Upload, t as X } from "../_libs/lucide-react.mjs";
import { i as cn, r as Shell, t as Button } from "./chrome-DBG2zFzu.mjs";
import { t as Badge } from "./badge-C05TCKcm.mjs";
import { u as VAULT } from "./data-Cr8tmURJ.mjs";
import { t as downloadText } from "./download-DuRIImBz.mjs";
import { t as Textarea } from "./textarea-DVUUnBVb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vault-ClvtEnBJ.js
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
var UPLOAD_KINDS = [
	"SOP",
	"Standard",
	"Manual",
	"Drawing",
	"Template",
	"Mail"
];
var DEFAULT_DESCRIPTION = "Retrieval is dense + keyword over this corpus only. Embeddings live on 10.12.0.8. A query never constructs an HTTPS host outside the plant prefix.";
function formatUploadedDate(value) {
	const [year, month] = value.split("-").map((part) => Number.parseInt(part, 10));
	if (!year || !month) return value;
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(new Date(year, month - 1, 1));
}
function toFileStem(fileName) {
	return fileName.replace(/\.[^.]+$/, "");
}
function toVaultFileName(doc) {
	if (!doc) return "";
	return doc.fileName ?? `${doc.title.replace(/[^\w.-]+/g, "_")}.pdf`;
}
function currentUploadStamp() {
	const now = /* @__PURE__ */ new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
function VaultPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("All");
	const [docs, setDocs] = (0, import_react.useState)(() => VAULT);
	const [open, setOpen] = (0, import_react.useState)(VAULT[0]?.id ?? "");
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [addingKnowledge, setAddingKnowledge] = (0, import_react.useState)(false);
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const [draftTitle, setDraftTitle] = (0, import_react.useState)("");
	const [draftDescription, setDraftDescription] = (0, import_react.useState)(DEFAULT_DESCRIPTION);
	const [uploadDraft, setUploadDraft] = (0, import_react.useState)({
		title: "",
		category: "SOP",
		description: "",
		fileName: ""
	});
	const rows = (0, import_react.useMemo)(() => {
		return docs.filter((d) => {
			const hay = `${d.title} ${d.excerpt} ${d.kind}`.toLowerCase();
			const matchQ = q.trim() === "" || hay.includes(q.toLowerCase());
			const matchK = kind === "All" || d.kind === kind;
			return matchQ && matchK;
		});
	}, [
		q,
		kind,
		docs
	]);
	const active = rows.find((r) => r.id === open) ?? rows[0];
	const saved = active ? drafts[active.id] : void 0;
	const displayTitle = saved?.title ?? active?.title ?? "";
	const displayDescription = saved?.description ?? DEFAULT_DESCRIPTION;
	const displayFileName = toVaultFileName(active);
	(0, import_react.useEffect)(() => {
		if (!active) return;
		const next = drafts[active.id];
		setDraftTitle(next?.title ?? active.title);
		setDraftDescription(next?.description ?? DEFAULT_DESCRIPTION);
		setEditing(false);
		setAddingKnowledge(false);
	}, [active?.id, drafts]);
	const handleDownload = () => {
		if (!active) return;
		downloadText(displayFileName, `${displayTitle}\n\n${active.pages} pages · uploaded on ${formatUploadedDate(active.uploaded)}\n\n${displayDescription}\n`, "text/plain");
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
				description: draftDescription.trim() || DEFAULT_DESCRIPTION
			}
		}));
		setEditing(false);
	};
	const handleStartAddKnowledge = () => {
		setAddingKnowledge(true);
		setEditing(false);
		setUploadDraft({
			title: "",
			category: "SOP",
			description: "",
			fileName: ""
		});
	};
	const handleUploadFileChange = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setUploadDraft((current) => ({
			...current,
			fileName: file.name,
			title: current.title.trim() || toFileStem(file.name)
		}));
	};
	const handleSaveKnowledge = () => {
		if (!uploadDraft.fileName) return;
		const fileName = uploadDraft.fileName;
		const title = uploadDraft.title.trim() || toFileStem(fileName);
		const description = uploadDraft.description.trim() || DEFAULT_DESCRIPTION;
		const stamp = currentUploadStamp();
		const id = `vault-${Date.now().toString(36)}`;
		const nextDoc = {
			id,
			title,
			fileName,
			class: "Internal",
			kind: uploadDraft.category,
			uploaded: stamp,
			updated: stamp,
			pages: 1,
			excerpt: description
		};
		setDocs((current) => [nextDoc, ...current]);
		setOpen(id);
		setAddingKnowledge(false);
		setUploadDraft({
			title: "",
			category: "SOP",
			description: "",
			fileName: ""
		});
	};
	const handleCancelAddKnowledge = () => {
		setAddingKnowledge(false);
		setUploadDraft({
			title: "",
			category: "SOP",
			description: "",
			fileName: ""
		});
	};
	const handleDelete = () => {
		if (!active) return;
		const nextDocs = docs.filter((doc) => doc.id !== active.id);
		setDocs(nextDocs);
		setOpen(nextDocs[0]?.id ?? "");
		setEditing(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		mode: "app",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col md:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex min-h-0 w-full flex-col border-border md:w-96 md:border-r lg:w-[28rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs uppercase tracking-widest text-ok",
								children: "Knowledge vault"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								type: "button",
								onClick: handleStartAddKnowledge,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add knowledge"]
							})]
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
								d.pages,
								" pages · uploaded on ",
								formatUploadedDate(d.uploaded)
							]
						})]
					}) }, d.id)), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-3 py-8 text-sm text-muted-foreground",
						children: "No documents in this slice."
					}) : null]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
				className: "hidden min-h-0 flex-1 overflow-y-auto p-6 md:block",
				children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-xl",
					children: addingKnowledge ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 rounded-2xl border border-border bg-elevated/70 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[11px] uppercase tracking-[0.2em] text-faint",
									children: "Upload"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2 font-display text-2xl font-medium tracking-tight",
									children: "Add knowledge"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "ok",
									children: "Internal"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px] uppercase tracking-[0.2em] text-faint",
										children: "File"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "file",
										onChange: handleUploadFileChange,
										"aria-label": "Upload file"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: uploadDraft.fileName ? `Selected: ${uploadDraft.fileName}` : "Choose a file from your system."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] uppercase tracking-[0.2em] text-faint",
									children: "Title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: uploadDraft.title,
									onChange: (e) => setUploadDraft((current) => ({
										...current,
										title: e.target.value
									})),
									placeholder: "Document title",
									"aria-label": "Upload title"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] uppercase tracking-[0.2em] text-faint",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: uploadDraft.category,
									onChange: (e) => setUploadDraft((current) => ({
										...current,
										category: e.target.value
									})),
									className: "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									"aria-label": "Upload category",
									children: UPLOAD_KINDS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: option,
										children: option
									}, option))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] uppercase tracking-[0.2em] text-faint",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: uploadDraft.description,
									onChange: (e) => setUploadDraft((current) => ({
										...current,
										description: e.target.value
									})),
									className: "min-h-32",
									placeholder: "Short description",
									"aria-label": "Upload description"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									onClick: handleSaveKnowledge,
									disabled: !uploadDraft.fileName,
									className: "min-w-24",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Save"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									type: "button",
									onClick: handleCancelAddKnowledge,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), "Cancel"]
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
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
								className: "shrink-0",
								type: "button",
								onClick: handleStartEdit,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PencilLine, { className: "size-4" }), "Edit"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2",
							children: [editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draftTitle,
								onChange: (e) => setDraftTitle(e.target.value),
								className: "h-11 font-display text-2xl font-medium tracking-tight",
								"aria-label": "Edit title"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-medium tracking-tight",
								children: displayTitle
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs uppercase tracking-widest text-faint",
								children: [
									active.pages,
									" pages · uploaded on ",
									formatUploadedDate(active.uploaded)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 rounded-xl border border-border bg-background/70 px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
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
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] uppercase tracking-[0.2em] text-faint",
								children: "File description"
							}), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: draftDescription,
								onChange: (e) => setDraftDescription(e.target.value),
								className: "min-h-32",
								"aria-label": "Edit file description"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rounded-lg border border-border bg-elevated p-4 text-sm leading-relaxed text-foreground/90",
								children: displayDescription
							})]
						}),
						editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								type: "button",
								onClick: handleDelete,
								className: "border border-border bg-destructive/10 text-crit hover:bg-destructive/15",
								children: "Delete file"
							})
						}) : null
					] })
				}) : null
			})]
		})
	});
}
var SplitComponent = VaultPage;
//#endregion
export { SplitComponent as component };
