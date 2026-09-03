import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./button-oUzGrMHr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spotlight-card-CwvJ6BMR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** React Bits SpotlightCard: cursor-following highlight on a surface. */
function SpotlightCard({ children, className }) {
	const ref = (0, import_react.useRef)(null);
	function onMove(e) {
		const el = ref.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
		el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		onMouseMove: onMove,
		className: cn("relative overflow-hidden rounded-3xl bg-card text-card-foreground shadow-[var(--shadow-border)]", className),
		style: { backgroundImage: "radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 0%), color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%)" },
		children
	});
}
//#endregion
export { SpotlightCard as t };
