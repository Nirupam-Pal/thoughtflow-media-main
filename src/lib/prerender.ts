/** True when HTML was generated at build time (Playwright prerender). */
export function isPrerenderedDocument(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.hasAttribute("data-prerendered")
  );
}
