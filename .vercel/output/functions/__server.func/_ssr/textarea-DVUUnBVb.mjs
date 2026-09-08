import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as cn } from "./chrome-DBG2zFzu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/textarea-DVUUnBVb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-md border border-input bg-secondary px-3 py-3 text-sm text-foreground placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
//#endregion
export { Textarea as t };
