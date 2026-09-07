import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ShieldOff } from "../_libs/lucide-react.mjs";
import { a as cn, i as Shell, n as Button, t as Badge } from "./chrome-CqOWarH-.mjs";
import { t as Crop } from "./crop-D4TWFupD.mjs";
import { a as LOCAL_NET, c as SEED_PACKETS } from "./data-BgIw8gnC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proof-CL31NXFi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROTATE = [
	{
		proto: "gRPC",
		src: "10.12.0.10",
		dst: "10.12.0.5:8000",
		svc: "vllm.complete",
		bytes: 8192,
		action: "allow"
	},
	{
		proto: "HTTP",
		src: "10.12.0.10",
		dst: "10.12.0.8:6333",
		svc: "qdrant.search",
		bytes: 1024,
		action: "allow"
	},
	{
		proto: "S3",
		src: "10.12.0.10",
		dst: "10.12.0.9:9000",
		svc: "minio.put",
		bytes: 24576,
		action: "allow"
	},
	{
		proto: "gRPC",
		src: "10.12.0.10",
		dst: "10.12.0.4:50051",
		svc: "vision.ocr",
		bytes: 4096,
		action: "allow"
	},
	{
		proto: "vsock",
		src: "127.0.0.1",
		dst: "127.0.0.1:5000",
		svc: "sandbox.exec",
		bytes: 512,
		action: "allow"
	}
];
function stamp() {
	return (/* @__PURE__ */ new Date()).toLocaleTimeString("en-GB", { hour12: false });
}
function ProofPage() {
	const [packets, setPackets] = (0, import_react.useState)(SEED_PACKETS);
	const [probe, setProbe] = (0, import_react.useState)("idle");
	const [denied, setDenied] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let i = 0;
		const id = window.setInterval(() => {
			const next = ROTATE[i % ROTATE.length];
			i += 1;
			setPackets((p) => [{
				t: stamp(),
				...next
			}, ...p].slice(0, 18));
		}, 1800);
		return () => window.clearInterval(id);
	}, []);
	function probeInternet() {
		setProbe("deny");
		setDenied((n) => n + 1);
		setPackets((p) => [{
			t: stamp(),
			proto: "HTTPS",
			src: "10.12.0.10",
			dst: "1.1.1.1:443",
			svc: "egress.probe",
			bytes: 0,
			action: "deny"
		}, ...p]);
	}
	const allowed = packets.filter((p) => p.action === "allow").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		mode: "page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-widest text-ok",
					children: "Sovereignty proof"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 max-w-2xl font-display text-3xl font-medium tracking-tight md:text-4xl",
					children: "External calls: zero. The log is the claim."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base",
					children: "Policy is deny-all egress. Only RFC1918, link-local, and loopback. Probe the public internet from this console — the packet is born already dead."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs uppercase tracking-widest text-faint",
									children: "External"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-5xl font-medium tabular-nums leading-none",
									children: "0"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-ok",
									children: "Destinations outside the fence"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs uppercase tracking-widest text-faint",
									children: "Allowed local"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-5xl font-medium tabular-nums leading-none",
									children: allowed
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: "This session, on-subnet only"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs uppercase tracking-widest text-faint",
									children: "Denied probes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-5xl font-medium tabular-nums leading-none",
									children: denied
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: "Simulated HTTPS to 1.1.1.1"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						onClick: probeInternet,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, {}), "Probe the public internet"]
					}), probe === "deny" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-crit",
						children: "DENY · HTTPS 1.1.1.1:443 · policy default-drop"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Nothing here opens a public socket."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 grid gap-6 lg:grid-cols-[1fr_20rem]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "overflow-hidden rounded-xl border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "Packet log"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "ok",
								children: "Live · local"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full min-w-lg text-left font-mono text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-faint",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-2 font-medium",
												children: "Time"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 font-medium",
												children: "Proto"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 font-medium",
												children: "Dest"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 font-medium",
												children: "Service"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 font-medium",
												children: "Bytes"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-2 font-medium",
												children: "Action"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: packets.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border/60",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 tabular-nums text-muted-foreground",
											children: p.t
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2",
											children: p.proto
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2",
											children: p.dst
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2",
											children: p.svc
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2 tabular-nums",
											children: p.bytes
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: cn("px-4 py-2 uppercase", p.action === "deny" ? "text-crit" : "text-ok"),
											children: p.action
										})
									]
								}, `${p.t}-${p.dst}-${i}`)) })]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Crop, {
							className: "rounded-xl bg-card p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs uppercase tracking-widest text-faint",
								children: "Premises"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-2",
								children: LOCAL_NET.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block",
										children: h.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-faint",
										children: h.ip
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: h.role
									})]
								}, h.ip))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-dashed border-border p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs uppercase tracking-widest text-faint",
								children: "Policy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-mono text-xs leading-relaxed text-muted-foreground",
								children: [
									"ALLOW 10.0.0.0/8",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"ALLOW 172.16.0.0/12",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"ALLOW 192.168.0.0/16",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"ALLOW 127.0.0.0/8",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"DENY 0.0.0.0/0"
								]
							})]
						})]
					})]
				})
			]
		})
	});
}
var SplitComponent = ProofPage;
//#endregion
export { SplitComponent as component };
