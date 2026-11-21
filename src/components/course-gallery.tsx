'use client'
import {SiteLink} from '@/components/site-link'

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

export function CourseGallery({slides, label}: {slides: Slide[]; label: string}) {
  // Five 291px previews can be visible across the site's widest container.
  // Keep one extra preview available for Embla to move across the loop boundary.
  const cycles = slides.some(slide => slide.kind === 'video') ? Math.ceil(6 / slides.length) : 1
  const visibleSlides = Array.from({length: Math.max(1, cycles)}, () => slides).flat()
  const [autoScroll] = useState(() => AutoScroll({
    speed: 2, startDelay: 0, playOnInit: false, stopOnInteraction: true,
    stopOnFocusIn: false, breakpoints: {'(prefers-reduced-motion: reduce)': {active: false}},
  }))
  const [viewport, api] = useEmblaCarousel({loop: true, align: 'start'}, [autoScroll])
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    if (!api) return
    function sync() {
      if (hovered || focused || visibleSlides.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) autoScroll.stop()
      else autoScroll.play()
    }
    sync()
    api.on('reInit', sync).on('pointerUp', sync)
    return () => { api.off('reInit', sync).off('pointerUp', sync) }
  }, [api, autoScroll, hovered, focused, visibleSlides.length])

  if (!slides.length) return null
  return <div className={styles.gallery} role="region" aria-label={label} aria-roledescription="carrossel"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={event => setFocused(event.target.matches(':focus-visible'))}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <div ref={viewport} className={styles.viewport}>
      <div className={styles.track} data-count={slides.length}>
      {visibleSlides.map((slide, index) => {
        const copy = Math.floor(index / slides.length)
        const key = `${copy}-${slide.key}`
        const image = slide.image && <Image {...slide.image} alt={slide.image.alt} unoptimized />
        if (slide.kind === 'photo') return <div key={key} aria-hidden={copy > 0 || undefined} className={styles.slide}>{image}</div>
        if (slide.kind === 'instagramPost') return <SiteLink className={styles.slide} key={key} tabIndex={copy ? -1 : undefined} href={slide.url}>
          {image}<span>{slide.title || 'Ver publicação no Instagram'} ↗</span>
        </SiteLink>
        return <SiteLink className={styles.videoPreview} key={key} tabIndex={copy ? -1 : undefined} href={slide.url}
          aria-label={`${slide.title || slide.image?.alt || 'Abrir vídeo'}`}>
          {image}
        </SiteLink>
      })}
    </div>
    </div>
  </div>
}
