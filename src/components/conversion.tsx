import styles from "./home-sections.module.css";

type Button = {label?: string | null; href?: string | null};

export function Action({button, final = false}: {button: Button | null | undefined; final?: boolean}) {
  if (!button?.label || !button.href || !/^(?:https?:\/\/|\/(?![\/\\])|#)/i.test(button.href)) return null;
  return <a className={final ? styles.finalButton : styles.button} href={button.href}>
    {button.label}{!final && <span aria-hidden="true"> →</span>}
  </a>;
}

export function Conversion({id, data}: {id?: string | null; data: {statement?: string | null; button?: Button | null}}) {
  return <section id={id ?? undefined} className={styles.conversion} aria-label="Solicitar proposta">
    {data.statement && <h2>{data.statement}</h2>}
    <Action button={data.button} final />
  </section>;
}
