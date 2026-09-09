//#region node_modules/.nitro/vite/services/ssr/assets/download-DuRIImBz.js
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
//#endregion
export { downloadText as t };
