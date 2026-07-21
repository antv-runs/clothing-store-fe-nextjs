export function getSiteUrl(): URL {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    "http://localhost:3000";

  const normalizedUrl = siteUrl.startsWith("http")
    ? siteUrl
    : `https://${siteUrl}`;

  return new URL(normalizedUrl);
}
