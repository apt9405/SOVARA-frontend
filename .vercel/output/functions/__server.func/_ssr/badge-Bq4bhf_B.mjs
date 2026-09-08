import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./chrome-C9eRfZ3j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-Bq4bhf_B.js
var import_jsx_runtime = require_jsx_runtime();
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
//#endregion
export { Badge as t };
