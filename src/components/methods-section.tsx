import Image from "next/image";
import type {HOME_PAGE_QUERY_RESULT} from "../../sanity.types";
import styles from "./methods-section.module.css";

type Methods = NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>["process"]>;

export function MethodsSection({id, content}: {id: string | null; content: Methods}) {
  const methods = content.methods?.filter(method => method.title || method.description || method.icon);
  if (!methods?.length) return null;

  return (
    <section id={id ?? undefined} className={styles.section} aria-label={content.eyebrow || "Como trabalhamos"}>
      <div className={styles.inner}>
        {content.eyebrow && <h2 className={styles.heading}>{content.eyebrow}</h2>}
        <ul className={styles.cards}>
          {methods.map(method => (
            <li key={method._key} className={styles.card}>
              {method.icon && <div className={styles.icon}>
                <Image src={method.icon} alt={method.alt ?? ""} width={64} height={64} unoptimized />
              </div>}
              <div>
                {method.title && <h3>{method.title}</h3>}
                {method.description && <p>{method.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
