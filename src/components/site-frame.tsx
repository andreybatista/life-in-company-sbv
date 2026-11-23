import {SiteLink} from '@/components/site-link';
import {MobileMenu} from './mobile-menu';
import Image from "next/image";
import Link from "next/link";
import {getSiteFrame, routes} from "@/sanity/site-frame";

type Settings = NonNullable<Awaited<ReturnType<typeof getSiteFrame>>["settings"]>;

function hasRoute(page: string): page is keyof typeof routes {
  return Object.hasOwn(routes, page);
}

function Brand({logo, name}: {logo: Settings["headerLogo"]; name: string}) {
  return <Link href="/" className="brand">
    {logo?.url && logo.size ? <Image src={logo.url} alt={name} width={logo.size.width} height={logo.size.height} unoptimized /> : name}
  </Link>;
}

export async function SiteFrame({pageId, children}: {
  pageId?: keyof typeof routes;
  children: React.ReactNode;
}) {
  const {settings, header} = await getSiteFrame(pageId ?? "homePage");
  const button = header?.button;
  const name = settings?.name || "Life in Company SBV";
  const navigation = settings?.navigation?.flatMap(({_key, page, label}) =>
    page && label && hasRoute(page)
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
        {!header?.hideHeaderMenu && !!navigation?.length && (<nav className="desktop-nav" aria-label="Menu principal">{navigation}</nav>)}
        {!header?.hideHeaderMenu && !!navigation?.length && <MobileMenu>{navigation}</MobileMenu>}
        {button?.label && button.url?.startsWith("https://") && <SiteLink data-button className="header-action" href={button.url}>
          {button.label}<span className="whatsapp-icon" aria-hidden="true" />
        </SiteLink>}
      </div>
    </header>
    {button?.url?.startsWith("https://") && <SiteLink data-button className="floating-whatsapp" href={button.url} aria-label={button.label || 'Fale no WhatsApp'}>
      <span className="whatsapp-icon" aria-hidden="true" />
    </SiteLink>}
    {children}
    <footer className="site-footer">
      <div className="site-container footer-row">
        <Brand logo={settings?.footerLogo ?? null} name={name} />
        <address className="contacts">
          {number && <SiteLink href={`https://wa.me/${number}`}>WhatsApp  {settings?.phone}</SiteLink>}
          {instagram && <SiteLink href={`https://www.instagram.com/${encodeURIComponent(instagram)}/`}>Instagram  @{instagram}</SiteLink>}
          {settings?.email && <SiteLink href={`mailto:${settings.email}`}>{settings.email}</SiteLink>}
          {settings?.cnpj && <span>CNPJ: {settings.cnpj}</span>}
        </address>
      </div>
    </footer>
  </>;
}
