import { b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ArrowRight } from "../_libs/lucide-react.mjs";
import { i as cn, r as Shell, t as Button } from "./chrome-DBG2zFzu.mjs";
import { t as Crop } from "./crop-cbxi64mR.mjs";
import { t as Badge } from "./badge-C05TCKcm.mjs";
import { o as MODELS } from "./data-Cr8tmURJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fleet-BxCgR6mL.js
var import_jsx_runtime = require_jsx_runtime();
var ROUTES = [
	{
		task: "Scanned report, P&ID, handwriting",
		need: "Vision + OCR",
		pick: "Qwen2-VL 7B",
		demo: "inspection"
	},
	{
		task: "Python, tests, internal tools",
		need: "Code + sandbox",
		pick: "Qwen2.5-Coder 32B",
		demo: "coding"
	},
	{
		task: "Approval note, SOP citation",
		need: "Long-form + retrieval",
		pick: "Llama 3.3 70B",
		demo: "inspection"
	}
];
function FleetPage() {
	const used = MODELS.filter((m) => m.loaded).reduce((n, m) => n + m.vramGb, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		mode: "page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-widest text-ok",
					children: "Model fleet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 max-w-2xl font-display text-3xl font-medium tracking-tight md:text-4xl",
					children: "Auto-select across task types. Swap weights without a redesign."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base",
					children: "The router reads the task, not a brand. Vision, coder, and instruct sit on the same mid-range box. A new open-weight model is a config row."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Loaded",
							value: `${MODELS.filter((m) => m.loaded).length} / ${MODELS.length}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "VRAM in use",
							value: `${used} GB`,
							hint: "of 80 GB dual GPU"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "External APIs",
							value: "0",
							hint: "weights on disk"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-3 md:grid-cols-2",
					children: MODELS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-medium",
									children: m.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: m.role
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: m.loaded ? "ok" : "default",
									children: m.loaded ? "Loaded" : "Standby"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-4 grid grid-cols-3 gap-2 font-mono text-xs uppercase tracking-wider text-faint",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Size" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 text-foreground",
										children: m.size
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "VRAM" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "mt-1 text-foreground",
										children: [m.vramGb, " GB"]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Pace" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 text-foreground",
										children: m.latency
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-1.5",
								children: m.tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: t }, t))
							})
						]
					}, m.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-14",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-medium tracking-tight",
							children: "Router map"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-xl text-sm text-muted-foreground",
							children: "Same prompt box, three paths. Run any of them on the workbench to watch the switch."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 overflow-hidden rounded-xl border border-border",
							children: ROUTES.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/workbench",
								search: { demo: r.demo },
								className: cn("flex flex-col gap-2 px-4 py-4 transition-colors duration-150 hover:bg-secondary/50 sm:flex-row sm:items-center sm:gap-6", i > 0 && "border-t border-border"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1 text-sm",
										children: r.task
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs uppercase tracking-widest text-faint",
										children: r.need
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2 text-sm font-medium",
										children: [r.pick, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 text-faint" })]
									})
								]
							}, r.task))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Crop, {
							className: "mt-6 hidden rounded-xl bg-elevated p-5 md:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs uppercase tracking-widest text-faint",
								children: "Decision"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-muted-foreground",
								children: "classify(task) → capabilities[] → first loaded model that covers the set → fallback to instruct. Adding a 120B-class weight is a registry insert; the workbench does not care who trained it, only that it never calls out."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/workbench",
								search: { demo: "coding" },
								children: "Watch a coding route"
							})
						})
					]
				})
			]
		})
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-widest text-faint",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-3xl font-medium tabular-nums leading-none",
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: hint
			}) : null
		]
	});
}
var SplitComponent = FleetPage;
//#endregion
export { SplitComponent as component };
