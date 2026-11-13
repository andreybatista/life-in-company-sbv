import type {Metadata} from 'next'
import {cache} from 'react'
import {defineQuery} from 'next-sanity'
import {client} from './client'
import {croppedPhoto} from './photo'

const serviceQuery = defineQuery(`*[_id == $id && _type == 'servicePage'][0]`)
export const serviceNames = {
  clinicasHospitais: 'Clínicas e Hospitais',
  academias: 'Academias',
  cursos: 'Cursos',
  edificioCardioprotegido: 'Edifício Cardioprotegido',
}
export type ServiceId = keyof typeof serviceNames
export const getService = cache((id: ServiceId) =>
  client.fetch(serviceQuery, {id}, {next: {revalidate: 30}}))

export async function serviceMetadata(id: ServiceId): Promise<Metadata> {
  const page = await getService(id)
  const seo = page?.seo
  const image = croppedPhoto(seo?.shareImage, 1200, 630)
  return {
    title: seo?.title || serviceNames[id],
    description: seo?.description || page?.hero?.description,
    robots: seo?.noIndex ? {index: false} : undefined,
    openGraph: image ? {images: [image.src]} : undefined,
  }
}
