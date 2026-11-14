'use client'

import Image from 'next/image'
import {useEffect, useRef, useState} from 'react'
import styles from './course.module.css'

export type Slide = {
  key: string
  kind: 'photo' | 'video' | 'instagramPost'
  title?: string
  url?: string
  image?: {src: string; alt: string; width: number; height: number}
}

function embedUrl(raw: string) {
  const url = new URL(raw)
  const parts = url.pathname.split('/').filter(Boolean)
  const host = url.hostname.replace(/^www\./, '')
  if (['youtube.com', 'm.youtube.com', 'youtu.be', 'youtube-nocookie.com'].includes(host)) {
    const id = host === 'youtu.be' ? parts[0] : url.searchParams.get('v') || parts[1]
    if (id && /^[\w-]{11}$/.test(id)) return 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1'
  }
  if (['vimeo.com', 'player.vimeo.com'].includes(host)) {
    const index = parts.findIndex(part => /^\d+$/.test(part))
    if (index >= 0) {
      const embed = new URL('https://player.vimeo.com/video/' + parts[index])
      embed.searchParams.set('autoplay', '1')
      const hash = url.searchParams.get('h') || parts[index + 1]
      if (hash) embed.searchParams.set('h', hash)
      return embed.href
    }
  }
}

export function CourseGallery({slides, label}: {slides: Slide[]; label: string}) {
  const track = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState<string>()
  const [edges, setEdges] = useState({start: true, end: true})
  useEffect(() => {
    const el = track.current
    if (!el) return
    const update = () => setEdges({start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2})
    const observer = new ResizeObserver(update)
    observer.observe(el)
    update()
    el.addEventListener('scroll', update)
    return () => { observer.disconnect(); el.removeEventListener('scroll', update) }
  }, [slides.length])
  function move(direction: number) {
    const el = track.current
    const first = el?.firstElementChild
    if (!first || !el) return
    const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap)
    el.scrollBy({left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'})
    setPlaying(undefined)
  }
  if (!slides.length) return null
  return <div className={styles.gallery} role="region" aria-label={label} aria-roledescription="carrossel">
    <div ref={track} className={styles.track} tabIndex={0}>
      {slides.map(slide => {
        const image = slide.image && <Image {...slide.image} unoptimized />
        if (slide.kind === 'photo') return <div key={slide.key} className={styles.slide}>{image}</div>
        if (slide.kind === 'instagramPost') return <a className={styles.slide} key={slide.key} href={slide.url} target="_blank" rel="noopener noreferrer">
          {image}<span>{slide.title || 'Ver publicação no Instagram'} ↗</span>
        </a>
        const src = slide.url!
        const embed = playing === slide.key && embedUrl(src)
        return <div className={styles.slide} key={slide.key}>
          {playing !== slide.key ? <button type="button" onClick={() => setPlaying(slide.key)}>
            {image}<span>▶ {slide.title || 'Reproduzir vídeo'}</span>
          </button> : embed ? <iframe title={slide.title || 'Vídeo do treinamento'} src={embed} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /> :
            <video src={src} aria-label={slide.title} controls autoPlay playsInline />}
        </div>
      })}
    </div>
    {(!edges.start || !edges.end) && <div className={styles.controls}>
      <button aria-label="Item anterior" disabled={edges.start} onClick={() => move(-1)}><span className="arrow-icon arrow-back" aria-hidden="true" /></button>
      <button aria-label="Próximo item" disabled={edges.end} onClick={() => move(1)}><span className="arrow-icon" aria-hidden="true" /></button>
    </div>}
  </div>
}
