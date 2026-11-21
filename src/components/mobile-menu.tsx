'use client';

import {useEffect, useId, useRef, useState, type ReactNode} from 'react';
import {useRouter} from 'next/navigation';

export function MobileMenu({children}: {children: ReactNode}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const destination = useRef<string | null>(null);
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState(false);

  function close() {
    const panel = dialog.current;
    if (!panel?.open || panel.dataset.closing) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      panel.close();
      return;
    }
    panel.dataset.closing = 'true';
    closeTimer.current = setTimeout(() => panel.close(), 450);
  }

  useEffect(() => {
    const panel = dialog.current;
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      panel?.close();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const desktop = matchMedia('(min-width: 66.001rem)');
    const onResize = () => { if (desktop.matches) dialog.current?.close(); };
    desktop.addEventListener('change', onResize);
    return () => {
      document.body.style.overflow = previous;
      desktop.removeEventListener('change', onResize);
    };
  }, [open]);

  return <>
    <button ref={trigger} className="mobile-menu-trigger" type="button" aria-label="Abrir menu"
      aria-expanded={open} aria-controls={id} aria-haspopup="dialog"
      onClick={() => { dialog.current?.showModal(); setOpen(true); }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    <dialog ref={dialog} id={id} className="mobile-menu-dialog" aria-labelledby={`${id}-title`}
      onCancel={event => { event.preventDefault(); close(); }}
      onClose={() => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        delete dialog.current?.dataset.closing;
        setOpen(false);
        trigger.current?.focus();
        const href = destination.current;
        destination.current = null;
        if (href) router.push(href);
      }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
      }}>
      <div className="mobile-menu-heading">
        <h2 id={`${id}-title`}>Menu</h2>
        <button type="button" aria-label="Fechar menu" onClick={close} autoFocus>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <nav aria-label="Menu principal" onClickCapture={event => {
        const link = event.target instanceof Element ? event.target.closest('a') : null;
        if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
        const href = link.getAttribute('href');
        if (!href) return;
        event.preventDefault();
        destination.current = href;
        close();
      }}>{children}</nav>
    </dialog>
  </>;
}
