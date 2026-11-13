import type {ReactNode} from 'react'
import Image from 'next/image'
import {notFound} from 'next/navigation'
import {createImageUrlBuilder} from '@sanity/image-url'
import type {ServicePage as Content} from '../../sanity.types'
import {client} from '@/sanity/client'
import {getService, serviceNames, type ServiceId} from '@/sanity/services'
import {croppedPhoto} from '@/sanity/photo'
import {Action, Conversion} from './conversion'
import {Hero} from './hero'
import {SiteFrame} from './site-frame'
import {TextImageSection} from './text-image-section'
import styles from './service-page.module.css'

type Copy = {eyebrow?: string; title?: string; description?: string}
type Icon = NonNullable<Content['hero']>['mainImage']
type Card = {title?: string; description?: string; icon?: Icon; _key: string}
const images = createImageUrlBuilder(client)

export function Band({id, data, tone = 'sand', children}: {
  id?: string; data: Copy; tone?: 'sand' | 'dark' | 'white'; children?: ReactNode
}) {
  return <section id={id} className={styles[tone]} aria-label={data.title || data.eyebrow}>
    <div className={styles.inner}>
      {data.eyebrow && <p className={styles.eyebrow}>{data.eyebrow}</p>}
      {data.title && <h2>{data.title}</h2>}
      {data.description && <p className={styles.body}>{data.description}</p>}
      {children}
    </div>
  </section>
}

function IconImage({icon}: {icon: Icon}) {
  return icon?.asset && <Image src={images.image(icon).url()} alt={icon.alt || ''} width={48} height={48} unoptimized />
}

export function Cards({items, layout = 'two', numbered, className = ''}: {
  items?: Card[]; layout?: 'two' | 'three' | 'five' | 'columns'; numbered?: boolean; className?: string
}) {
  if (!items?.length) return null
  return <ul className={`${styles[layout]} ${className}`}>{items.map((item, i) =>
    <li key={item._key} className={styles.card}>
      {item.icon?.asset && <span className={styles.icon}><IconImage icon={item.icon} /></span>}
      <div>
        {numbered && <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>}
        {item.title && <h3>{item.title}</h3>}
        {item.description && <p>{item.description}</p>}
      </div>
    </li>)}</ul>
}

function Labels({items, mode, className = ''}: {items?: string[]; mode: 'topics' | 'checks' | 'tags'; className?: string}) {
  if (!items?.length) return null
  const List = mode === 'topics' ? 'ol' : 'ul'
  return <List className={`${styles[mode]} ${className}`}>{items.map((item, i) =>
    <li key={i}>{mode !== 'tags' && <span aria-hidden="true">{mode === 'topics' ? i + 1 : '✓'}</span>}{item}</li>)}</List>
}

export async function ServicePage({id}: {id: ServiceId}) {
  const page = await getService(id)
  if (!page) notFound()
  const anchors = page.sectionIds ?? {}
  const {hero, reality, learning, process, methodology, differential, audience, materials, onlineCourse,
    responsibility, deliverables, commitment, equipment, developers, residents, contracting, contact} = page
  const law = responsibility?.legislation
  const building = id === 'edificioCardioprotegido'
  return <SiteFrame pageId={id}><main>
    <Hero {...hero} id={anchors.hero} title={hero?.title || serviceNames[id]} primary={hero?.button}
      image={croppedPhoto(hero?.mainImage, 960, 1006)} />
    {reality && <TextImageSection {...reality} id={anchors.reality} mainImage={croppedPhoto(reality.image, 720, building ? 460 : 720)} />}
    {id === 'clinicasHospitais' && <>
      {learning && <Band data={learning} id={anchors.learning} tone="dark"><Labels items={learning.topics} mode="topics" /></Band>}
      {process && <Band data={process} id={anchors.process}><Cards items={process.steps} layout="columns" /></Band>}
      {methodology && <Band data={methodology} id={anchors.methodology} tone="dark"><Cards items={methodology.principles} layout="five" /></Band>}
      {differential && <TextImageSection {...differential} id={anchors.differential} mainImage={croppedPhoto(differential.image, 740, 560)} />}
      {audience && <Band data={audience} id={anchors.audience} tone="white"><Labels items={audience.specialties} mode="tags" /></Band>}
      {materials && <Band data={materials} id={anchors.materials}><Labels items={materials.highlights} mode="checks" /><Action button={materials.button} /></Band>}
      {onlineCourse && <Band data={onlineCourse} id={anchors.onlineCourse} tone="dark"><Action button={onlineCourse.button} /></Band>}
    </>}
    {id !== 'clinicasHospitais' && responsibility && <section className={styles.dark} id={anchors.responsibility}>
      <div className={styles.legal}>
        <div><p className={styles.eyebrow}>{responsibility.eyebrow}</p><h2>{responsibility.title}</h2><p className={styles.body}>{responsibility.description}</p></div>
        {law && <aside><h3><IconImage icon={law.icon} />{law.title}</h3>
          <ul>{law.laws?.map(entry => <li key={entry._key}>{entry.url && /^https?:\/\//i.test(entry.url)
            ? <a href={entry.url}>{entry.title}</a> : entry.title}{entry.title && entry.description && ': '}{entry.description}</li>)}</ul>
        </aside>}
      </div>
    </section>}
    {id === 'academias' && <>
      {deliverables && <Band data={deliverables} id={anchors.deliverables}><Labels items={deliverables.items} mode="checks" className={styles.deliverables} /></Band>}
      {commitment && <TextImageSection dark {...commitment} id={anchors.commitment} mainImage={croppedPhoto(commitment.image, 720, 620)} />}
    </>}
    {building && <>
      {equipment && <Band data={equipment} id={anchors.equipment}><Cards items={equipment.items} layout="three" /></Band>}
      {developers && <Band data={developers} id={anchors.developers} tone="dark"><Cards items={developers.benefits} /></Band>}
      {residents && <Band data={residents} id={anchors.residents}><Cards items={residents.items} className={styles.residents} /></Band>}
      {contracting && <Band data={contracting} id={anchors.contracting} tone="dark"><Cards items={contracting.formats} layout="three" numbered /></Band>}
    </>}
    {contact && <Conversion id={anchors.contact} data={contact} />}
  </main></SiteFrame>
}
