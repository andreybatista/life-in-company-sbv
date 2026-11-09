import styles from "./importance-section.module.css";

type ImportanceProps = {
  id?: string | null;
  eyebrow?: string | null;
  statement?: string | null;
  description?: string | null;
};

export function ImportanceSection({id, eyebrow, statement, description}: ImportanceProps) {
  if (!eyebrow && !statement && !description) return null;

  return (
    <section id={id ?? undefined} className={styles.section} aria-label={eyebrow || statement || undefined}>
      <div className={styles.inner}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        {statement && <h2 className={styles.statement}>{statement}</h2>}
        {description && <div className={styles.description}>
          {description.trim().split(/\r?\n\s*\r?\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>}
      </div>
      <div className={styles.ecg} aria-hidden="true" />
    </section>
  );
}
