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

export function CourseGallery({slides, label}: {slides: Slide[]; label: string}) {
  const [autoScroll] = useState(() => AutoScroll({
    speed: 4, startDelay: 0, playOnInit: false, stopOnInteraction: true,
    stopOnFocusIn: false, breakpoints: {'(prefers-reduced-motion: reduce)': {active: false}},
  }))
  const [viewport, api] = useEmblaCarousel({loop: true, align: 'start'}, [autoScroll])
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    if (!api) return
    function sync() {
      if (hovered || focused || slides.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) autoScroll.stop()
      else autoScroll.play()
    }
    sync()
    api.on('reInit', sync).on('pointerUp', sync)
    return () => { api.off('reInit', sync).off('pointerUp', sync) }
  }, [api, autoScroll, hovered, focused, slides.length])

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
        return <a className={styles.videoPreview} key={slide.key} href={slide.url} target="_blank" rel="noopener noreferrer"
          aria-label={`${slide.title || slide.image?.alt || 'Abrir vídeo'} (abre em nova aba)`}>
          {image}
        </a>
      })}
    </div>
    </div>
  </div>
}
