import type {Metadata} from 'next'
import {cache} from 'react'
import {defineQuery} from 'next-sanity'
import type {Seo} from '../../sanity.types'
import {client} from './client'
import {croppedPhoto} from './photo'
import {routes} from './site-frame'
import {siteOrigin} from '@/lib/site-url'

const settingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  "siteName": seoDefaults.siteName, "description": seoDefaults.description,
  "shareImage": seoDefaults.shareImage, "favicon": favicon.asset->url
}`)
export const getSeoSettings = cache(() => client.fetch(settingsQuery, {}, {next: {revalidate: 30}}))

export async function pageMetadata(id: keyof typeof routes, pageName?: string, seo?: Seo | null, intro?: string | null): Promise<Metadata> {
  const defaults = await getSeoSettings()
  const siteName = defaults?.siteName || 'Life in Company SBV'
  const title = seo?.title || pageName || siteName
  const description = seo?.description || defaults?.description || intro || undefined
  const image = croppedPhoto(seo?.shareImage?.asset ? seo.shareImage : defaults?.shareImage, 1200, 630)
  const url = new URL(routes[id], siteOrigin).href
  return {
    title, description,
    alternates: url ? {canonical: url} : undefined,
    robots: seo?.noIndex ? {index: false} : undefined,
    openGraph: {type: 'website', locale: 'pt_BR', siteName, title, description, url, images: image ? [image.src] : undefined},
    twitter: {card: image ? 'summary_large_image' : 'summary', title, description, images: image ? [image.src] : undefined},
  }
}
