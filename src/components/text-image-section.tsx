import Image from "next/image";
import styles from "./text-image-section.module.css";

type Photo = {src: string; alt: string; width: number; height: number};

type TextImageSectionProps = {
  id?: string | null;
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  dark?: boolean;
  mainImage?: Photo;
  secondaryImages?: readonly (Photo | undefined)[];
};

export function TextImageSection({
  id, eyebrow, title, body, mainImage, dark, secondaryImages = [],
}: TextImageSectionProps) {
  if (!title && !eyebrow && !body && !mainImage && !secondaryImages.some(Boolean)) return null;
  return (
    <section id={id ?? undefined} className={[styles.section, dark && styles.dark].filter(Boolean).join(" ")} aria-label={eyebrow || title || undefined}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          {title && <h2>{title}</h2>}
          {body && <div className={styles.body}>{body.trim().split(/\r?\n\s*\r?\n/).map((paragraph, index) =>
            <p key={index}>{paragraph}</p>
          )}</div>}
        </div>
        {(mainImage || secondaryImages.some(Boolean)) && <div className={styles.gallery}>
          {mainImage && <Image {...mainImage} className={styles.mainPhoto} unoptimized />}
          {secondaryImages.map((photo, index) => photo && (
            <Image key={index} {...photo} unoptimized />
          ))}
        </div>}
      </div>
    </section>
  );
}
