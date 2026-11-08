import Image from "next/image";
import Link from "next/link";
import {getSiteFrame, routes} from "@/sanity/site-frame";

type Settings = NonNullable<Awaited<ReturnType<typeof getSiteFrame>>["settings"]>;

function Brand({logo, name}: {logo: Settings["headerLogo"]; name: string}) {
  return <Link href="/" className="brand">
    {logo?.url && logo.size ? <Image src={logo.url} alt={name} width={logo.size.width} height={logo.size.height} unoptimized /> : name}
  </Link>;
}

export async function SiteFrame({pageId, children}: {
  pageId: keyof typeof routes;
  children: React.ReactNode;
}) {
  const {settings, button} = await getSiteFrame(pageId);
  const name = settings?.name || "Life in Company SBV";
  const navigation = settings?.navigation?.flatMap(({_key, page, label}) =>
    page && label && Object.hasOwn(routes, page)
      ? [<Link key={_key} href={routes[page]} aria-current={page === pageId ? "page" : undefined}>{label}</Link>]
      : []
  );
  const phone = settings?.phone?.replace(/\D/g, "");
  const number = phone && [10, 11].includes(phone.length) ? "55" + phone : phone;
  const instagram = settings?.instagramHandle?.trim().replace(/^@/, "");
  return <>
    <header className="site-header">
      <div className="site-container header-row">
        <Brand logo={settings?.headerLogo ?? null} name={name} />
        {!!navigation?.length && <>
          <nav className="desktop-nav" aria-label="Menu principal">{navigation}</nav>
          <details className="mobile-nav">
            <summary>Menu</summary>
            <nav aria-label="Menu principal">{navigation}</nav>
          </details>
        </>}
        {button?.label && button.url?.startsWith("https://") && <a className="header-action" href={button.url}>
          {button.label}<span className="whatsapp-icon" aria-hidden="true" />
        </a>}
      </div>
    </header>
    {children}
    <footer className="site-footer">
      <div className="site-container footer-row">
        <Brand logo={settings?.footerLogo ?? null} name={name} />
        <address className="contacts">
          {number && <a href={`https://wa.me/${number}`}>WhatsApp  {settings?.phone}</a>}
          {instagram && <a href={`https://www.instagram.com/${encodeURIComponent(instagram)}/`}>Instagram  @{instagram}</a>}
          {settings?.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
          {settings?.cnpj && <span>CNPJ: {settings.cnpj}</span>}
        </address>
      </div>
    </footer>
  </>;
}
