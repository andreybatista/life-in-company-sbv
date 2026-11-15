import {notFound} from 'next/navigation'
import type {ServicePage} from '../../../sanity.types'
import {getService, serviceMetadata} from '@/sanity/services'
import {croppedPhoto} from '@/sanity/photo'
import {Band, Cards} from '@/components/service-page'
import {SiteFrame} from '@/components/site-frame'
import {Hero} from '@/components/hero'
import {TextImageSection} from '@/components/text-image-section'
import {Action} from '@/components/conversion'
import {Founder} from '@/components/home-sections'
import {CourseGallery, type Slide} from '@/components/course-gallery'
import styles from '@/components/course.module.css'

export const generateMetadata = () => serviceMetadata('cursos')

function formatSessionDate(date: string) {
  const [year, , day] = date.split('-')
  const month = new Intl.DateTimeFormat('pt-BR', {month: 'short', timeZone: 'UTC'})
    .format(new Date(date)).replace(/\.$/, '').toUpperCase()
  return [day, month, year].join(' · ')
}

function slidesFor(items: NonNullable<ServicePage['workGallery']>['media'] = []): Slide[] {
  return items.flatMap((item): Slide[] => {
    if (item._type === 'photo') {
      const image = croppedPhoto(item, 840, 490)
      return image ? [{key: item._key, kind: 'photo', image}] : []
    }
    if (!item.url || !URL.canParse(item.url) || new URL(item.url).protocol !== 'https:') return []
    return [{key: item._key, kind: item._type, title: item.title, url: item.url,
      image: item._type === 'video' ? croppedPhoto(item.poster, 582, 668) : croppedPhoto(item.thumbnail, 840, 490)}]
  })
}

function Sessions({id, data}: {id?: string; data: NonNullable<ServicePage['sessions']>}) {
  if (data.status !== 'pending' && data.status !== 'confirmed') return null
  return <Band id={id} data={{eyebrow: data.eyebrow}} tone="dark">
    <div className={styles.session}>
      <div className={styles.date}>
        {data.nextLabel && <p>{data.nextLabel}</p>}
        <h2>{data.status === 'pending' ? data.pendingLabel || 'Data a confirmar' : data.date &&
          <time dateTime={data.date}>{formatSessionDate(data.date)}</time>}</h2>
        <div>{[data.location, data.time].filter(Boolean).join(' · ')}</div>
      </div>
      {!!data.prices?.length && <>
        {data.investmentLabel && <h3>{data.investmentLabel}</h3>}
        <ul className={styles.prices}>{data.prices.map(price => <li key={price._key}>{price.label}<strong>{price.value}</strong></li>)}</ul>
      </>}
      <Action button={data.button} final />
    </div>
  </Band>
}

export default async function CoursePage() {
  const page = await getService('cursos')
  if (!page) notFound()
  const ids = page.sectionIds ?? {}
  const {hero, courseIntro, courseAudience, syllabus, learningFormats, practiceGallery, workGallery, instructor, sessions, faq} = page
  const work = slidesFor([...(workGallery?.videos ?? []), ...(workGallery?.media ?? [])])
  return <SiteFrame pageId="cursos"><main>
    <Hero {...hero} id={ids.hero} title={hero?.title || 'Cursos'} primary={hero?.button} image={croppedPhoto(hero?.mainImage, 960, 1006)} />
    {courseIntro && <TextImageSection {...courseIntro} id={ids.courseIntro} mainImage={croppedPhoto(courseIntro.image, 760, 650)} />}
    {courseAudience && <Band data={courseAudience} id={ids.courseAudience} tone="dark"><Cards items={courseAudience.items} /></Band>}
    {syllabus && <Band data={syllabus} id={ids.syllabus}><Cards items={syllabus.items} layout="three" numbered /></Band>}
    {learningFormats && <Band data={learningFormats} id={ids.learningFormats} tone="white">
      {!!learningFormats.items?.length && <ul className={styles.formats}>{learningFormats.items.map(item => <li key={item._key}>
        {item.eyebrow && <small>{item.eyebrow}</small>}<h3>{item.title}</h3><p>{item.description}</p><Action button={item.button} />
      </li>)}</ul>}
    </Band>}
    {(['schoolsProgram','clinicsProgram','gymsProgram','buildingsProgram'] as const).map((key, i) =>
      page[key] && <Band key={key} data={page[key]} id={ids[key]} tone={i % 2 ? 'sand' : 'dark'}><Action button={page[key].button} /></Band>)}
    {practiceGallery && <Band id={ids.practiceGallery} data={practiceGallery} tone="dark">
      <CourseGallery slides={slidesFor(practiceGallery.images)} label={practiceGallery.title || 'Fotos do treinamento'} />
    </Band>}
    {workGallery && <Band id={ids.workGallery} data={workGallery} tone="dark">
      <CourseGallery slides={work} label={workGallery.title || 'Nosso trabalho na prática'} />
    </Band>}
    {instructor && <Founder id={ids.instructor ?? null} photo={croppedPhoto(instructor.portrait, 580, 720)}
      data={{eyebrow: instructor.eyebrow ?? null, name: instructor.name ?? null, credentials: instructor.credentials ?? null,
        biography: instructor.biography ?? null, portrait: instructor.portrait ?? null}} />}
    {sessions && <Sessions id={ids.sessions} data={sessions} />}
    {faq && <Band data={faq} id={ids.faq} tone="white"><div className={styles.faq}>
      {faq.questions?.map((entry, i) => <details name="course-faq" key={entry._key} open={i === 0}>
        <summary>{entry.question}</summary>
        <div className={styles.answer}><p>{entry.answer}</p></div>
      </details>)}
    </div></Band>}
  </main></SiteFrame>
}
