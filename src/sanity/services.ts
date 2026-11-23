import type {Metadata} from 'next'
import {cache} from 'react'
import {defineQuery} from 'next-sanity'
import {client} from './client'
import {pageMetadata} from './seo'

const serviceQuery = defineQuery(`*[_id == $id && _type == 'servicePage'][0]`)
export const serviceNames = {
  clinicasHospitais: 'Clínicas e Hospitais',
  academias: 'Academias',
  escolas: 'Escolas',
  cursos: 'Cursos',
  edificioCardioprotegido: 'Edifício Cardioprotegido',
}
export type ServiceId = keyof typeof serviceNames
export const getService = cache((id: ServiceId) =>
  client.fetch(serviceQuery, {id}, {next: {revalidate: 30}}))

export async function serviceMetadata(id: ServiceId): Promise<Metadata> {
  const page = await getService(id)
  return pageMetadata(id, serviceNames[id], page?.seo, page?.hero?.description)
}
