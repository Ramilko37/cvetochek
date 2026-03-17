import { NextResponse } from "next/server"

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://cvetipolubvi.ru"
  ).replace(/\/$/, "")
}

const routes = [
  "",
  "/catalog",
  "/new",
  "/blog",
  "/delivery",
  "/contacts",
  "/faq",
  "/custom-order",
  "/subscription",
  "/payment",
  "/return",
  "/legal",
  "/offer",
  "/privacy",
  "/corporate",
  "/loyalty",
  "/care",
  "/sitemap",
]

export function GET() {
  const baseUrl = getBaseUrl()
  const lastmod = new Date().toISOString()

  const urls = routes
    .map((path) => {
      const url = `${baseUrl}${path}`
      return `<url><loc>${url}</loc><lastmod>${lastmod}</lastmod></url>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
