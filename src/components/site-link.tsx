'use client';

import {useSyncExternalStore, type ComponentProps} from 'react';

const subscribe = () => () => {};
const getOrigin = () => window.location.origin;
const getServerOrigin = () => '';

export function SiteLink({href, ...props}: Omit<ComponentProps<'a'>, 'target' | 'rel'>) {
  const origin = useSyncExternalStore(subscribe, getOrigin, getServerOrigin);
  let external = false;
  if (href && /^(https?:)?\/\//i.test(href.trim())) {
    try {
      external = !origin || new URL(href, origin).origin !== origin;
    } catch {
      external = false;
    }
  }
  return <a {...props} href={href} target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined} />;
}
