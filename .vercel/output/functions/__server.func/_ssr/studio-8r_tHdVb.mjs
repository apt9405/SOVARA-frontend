import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as FileText, D as Download, T as FileSpreadsheet, a as Terminal, p as Presentation } from "../_libs/lucide-react.mjs";
import { r as Shell, t as Button } from "./chrome-C9eRfZ3j.mjs";
import { t as Crop } from "./crop-DrAv3Tzk.mjs";
import { i as FINDINGS_CSV, l as SLIDES_HTML, n as DELIVERABLES, r as EXCHANGER_PY, t as APPROVAL_NOTE_HTML } from "./data-BD_wHvxO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-8r_tHdVb.js
var import_jsx_runtime = require_jsx_runtime();
function downloadText(filename, body, mime) {
	const blob = new Blob([body], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
var ICONS = {
	note: FileText,
	sheet: FileSpreadsheet,
	slides: Presentation,
	code: Terminal
};
function handleDownload(id) {
	if (id === "note-h302") downloadText("Approval_Note_H-302.doc", APPROVAL_NOTE_HTML, "application/msword");
	else if (id === "sheet-h302") downloadText("H-302_findings.csv", FINDINGS_CSV, "text/csv");
	else if (id === "code-lmtd") downloadText("exchanger_duty.py", EXCHANGER_PY, "text/x-python");
	else if (id === "slides-ta") downloadText("Turnaround_brief.html", SLIDES_HTML, "text/html");
}
function StudioPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		mode: "page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-widest text-ok",
					children: "Deliverable studio"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 max-w-2xl font-display text-3xl font-medium tracking-tight md:text-4xl",
					children: "Real files. Not a chat bubble."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base",
					children: "Notes, sheets, slides, and verified code written to the local vault. Download any artifact — they were composed on this box."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-3 sm:grid-cols-2",
					children: DELIVERABLES.map((d) => {
						const Icon = ICONS[d.kind];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "flex flex-col rounded-xl border border-border bg-card p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-10 items-center justify-center rounded-md bg-secondary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "truncate text-sm font-medium",
										children: d.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 font-mono text-xs text-faint",
										children: [
											d.size,
											" · ",
											d.from
										]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								className: "mt-4 self-start",
								onClick: () => handleDownload(d.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Download"]
							})]
						}, d.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12 grid gap-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Crop, {
						className: "overflow-hidden rounded-xl bg-paper text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-ink/15 px-5 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs uppercase tracking-widest text-ink/50",
								children: "Preview · note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-medium",
								children: "Approval note — Fired heater H-302"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 px-5 py-4 text-sm leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Recommendation."
							}), " Derate 8%, patch refractory this window, run an interim register sleeve from the site shop. Full-rate restart is not supported under OISD-STD-116."] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-ink/70",
								children: "Prepared without egress. Sources: H-302 scan, OISD-STD-116, vendor correspondence."
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Crop, {
						className: "overflow-hidden rounded-xl bg-elevated",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border px-5 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs uppercase tracking-widest text-faint",
								children: "Preview · code"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: "exchanger_duty.py"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "overflow-x-auto px-5 py-4 font-mono text-xs leading-relaxed text-muted-foreground",
							children: `def lmtd(t1, t2, t3, t4):
    d1, d2 = t1 - t4, t2 - t3
    if abs(d1 - d2) < 1e-9:
        return d1
    return (d1 - d2) / log(d1 / d2)

# sandbox: 4 passed · egress 0`
						})]
					})]
				})
			]
		})
	});
}
var SplitComponent = StudioPage;
//#endregion
export { SplitComponent as component };
