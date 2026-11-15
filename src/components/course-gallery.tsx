'use client'

import Image from 'next/image'
import {useEffect, useState} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
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
  const [autoScroll] = useState(() => AutoScroll({
    speed: 4, startDelay: 0, playOnInit: false, stopOnInteraction: true,
    stopOnFocusIn: false, breakpoints: {'(prefers-reduced-motion: reduce)': {active: false}},
  }))
  const [viewport, api] = useEmblaCarousel({loop: true, align: 'start'}, [autoScroll])
  const [playing, setPlaying] = useState<string>()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    if (!api) return
    function sync() {
      if (playing || hovered || focused || slides.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) autoScroll.stop()
      else autoScroll.play()
    }
    sync()
    api.on('reInit', sync).on('pointerUp', sync)
    const stopVideo = () => setPlaying(undefined)
    api.on('select', stopVideo)
    return () => { api.off('reInit', sync).off('pointerUp', sync).off('select', stopVideo) }
  }, [api, autoScroll, playing, hovered, focused, slides.length])

  if (!slides.length) return null
  return <div className={styles.gallery} role="region" aria-label={label} aria-roledescription="carrossel"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={event => setFocused(event.target.matches(':focus-visible'))}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <div ref={viewport} className={styles.viewport}>
      <div className={styles.track} data-count={slides.length}>
      {slides.map(slide => {
        const image = slide.image && <Image {...slide.image} alt={slide.image.alt} unoptimized />
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
            <video src={src} aria-label={slide.title} controls autoPlay playsInline onEnded={() => setPlaying(undefined)} />}
        </div>
      })}
    </div>
    </div>
  </div>
}
