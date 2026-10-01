/** Prefix public URLs only; logical route IDs remain independent of deployment. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export function siteUrl(url: string): string {
  if (!basePath || !url.startsWith("/") || url.startsWith("//") || url === basePath || url.startsWith(basePath + "/")) return url;
  return basePath + url;
}
export function siteHtml(html: string): string {
  return html.replace(/(\b(?:href|src|poster)=["'])(\/(?!\/)[^"']*)/g, (_, attribute, url) => attribute + siteUrl(url));
}
