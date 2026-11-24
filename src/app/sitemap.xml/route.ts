import {defineQuery} from 'next-sanity'
import {client} from '@/sanity/client'
import {routes} from '@/sanity/site-frame'
import {siteOrigin} from '@/lib/site-url'

const sitemapQuery = defineQuery(`*[_id in $ids && _type in ["servicePage", "homePage"] && seo.noIndex != true]{_id, _updatedAt}`)

export async function GET() {
  const pages = await client.fetch(sitemapQuery, {ids: Object.keys(routes)}, {next: {revalidate: 30}})
  const entries = pages.map(page => {
    const path = routes[page._id as keyof typeof routes]
    return `<url><loc>${siteOrigin}${path}</loc><lastmod>${page._updatedAt}</lastmod></url>`
  })
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`, {
    headers: {'Content-Type': 'application/xml; charset=utf-8'},
  })
}
