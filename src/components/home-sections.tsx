import Image from "next/image";
import type {HOME_PAGE_QUERY_RESULT} from "../../sanity.types";
import styles from "./home-sections.module.css";

type Home = NonNullable<HOME_PAGE_QUERY_RESULT>;
type Props<K extends keyof Home> = {id: string | null; data: NonNullable<Home[K]>};
type Photo = {photo?: {src: string; alt: string; width: number; height: number}};

function Action({button, final = false}: {button: NonNullable<Home["contact"]>["button"]; final?: boolean}) {
  if (!button?.label || !button.href || !/^(?:https?:\/\/|\/(?![\/\\])|#)/i.test(button.href)) return null;
  return <a className={final ? styles.finalButton : styles.button} href={button.href}>
    {button.label}{!final && <span aria-hidden="true"> →</span>}
  </a>;
}

export function Schools({id, data, photo}: Props<"schools"> & Photo) {
  return <section id={id ?? undefined} aria-label={data.eyebrow || "Escolas"} className={styles.schools}>
    <div className={styles.inner}>
      <div className={styles.intro}>
        <div>
          {data.eyebrow && <p className={styles.eyebrow}>{data.eyebrow}</p>}
          {data.title && <h2>{data.title}</h2>}
          {data.legalNotice && <p className={styles.notice}>
            <Image src="/octicon_law.svg" alt="" width={41} height={41} className={styles.lawIcon} unoptimized />
            {data.legalNotice}
          </p>}
        </div>
        {photo && <Image {...photo} unoptimized className={styles.schoolPhoto} />}
      </div>
      {data.description && <p className={styles.prose}>{data.description}</p>}
      {!!data.topics?.length && <ul className={styles.topics}>
        {data.topics.map((topic, i) => <li key={i}>{topic}</li>)}
      </ul>}
      {data.context && <p className={styles.prose}>{data.context}</p>}
      {data.formatsTitle && <h3 className={styles.formatsTitle}>{data.formatsTitle}</h3>}
      {!!data.formats?.length && <ul className={styles.formats}>
        {data.formats.map(format => <li key={format._key}>
          {format.title && <h4>{format.title}</h4>}
          {format.description && <p>{format.description}</p>}
          <Action button={format.button} />
        </li>)}
      </ul>}
    </div>
  </section>;
}

export function Founder({id, data, photo}: Props<"team"> & Photo) {
  return <section id={id ?? undefined} className={styles.founder} aria-label={data.eyebrow || "Quem está por trás"}>
    {photo && <Image {...photo} unoptimized />}
    <div>
      {data.eyebrow && <p className={styles.eyebrow}>{data.eyebrow}</p>}
      <div className={styles.founderDetails}>
        {data.name && <h2>{data.name}</h2>}
        {data.credentials && <p className={styles.credentials}>{data.credentials}</p>}
        {data.biography && <p className={styles.biography}>{data.biography}</p>}
      </div>
    </div>
  </section>;
}

export function Conversion({id, data}: Props<"contact">) {
  return <section id={id ?? undefined} className={styles.conversion} aria-label="Solicitar proposta">
    {data.statement && <h2>{data.statement}</h2>}
    <Action button={data.button} final />
  </section>;
}
