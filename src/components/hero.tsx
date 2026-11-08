import Image from "next/image";
import styles from "./hero.module.css";

type Action = {label?: string | null; href?: string | null};
type HeroProps = {
  id?: string | null;
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  image?: {src: string; alt: string};
  primary?: Action;
  secondary?: Action;
};

function HeroLink({label, href, primary}: {
  label?: string | null;
  href?: string | null;
  primary?: boolean;
}) {
  if (!label || !href || !/^(https?:\/\/|\/(?![\/\\])|#[a-z][a-z0-9-]*$)/i.test(href)) return null;
  return <a className={primary ? styles.primary : styles.secondary} href={href}>
    {label} <span aria-hidden="true">→</span>
  </a>;
}

export function Hero({id, eyebrow, title, description, image, primary, secondary}: HeroProps) {
  return (
  <section id={id ?? undefined} className={styles.hero} aria-labelledby="hero-heading">
    {image && <div className={styles.photo}>
      <Image
        src={image.src}
        alt={image.alt} width={960} height={1006} preload unoptimized
      />
    </div>}
    <div className={styles.container}>
      <div className={styles.copy}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 id="hero-heading">{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.actions}>
          <HeroLink primary href={primary?.href} label={primary?.label} />
          <HeroLink href={secondary?.href} label={secondary?.label} />
        </div>
      </div>
    </div>
  </section>
  );
}
