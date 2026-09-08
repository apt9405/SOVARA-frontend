import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as cn } from "./chrome-DBG2zFzu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crop-cbxi64mR.js
var import_jsx_runtime = require_jsx_runtime();
function Crop({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute -left-px -top-px size-2.5 border-l border-t border-foreground/35" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute -right-px -top-px size-2.5 border-r border-t border-foreground/35" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute -bottom-px -left-px size-2.5 border-b border-l border-foreground/35" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute -bottom-px -right-px size-2.5 border-b border-r border-foreground/35" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn(className),
				children
			})
		]
	});
}
//#endregion
export { Crop as t };
