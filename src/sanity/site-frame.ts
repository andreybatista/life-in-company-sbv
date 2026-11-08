import {defineQuery} from "next-sanity";
import {client} from "./client";

const SITE_FRAME_QUERY = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{
    "name": seoDefaults.siteName,
    "headerLogo": headerLogo.asset->{url, "size": metadata.dimensions},
    "footerLogo": footerLogo.asset->{url, "size": metadata.dimensions},
    navigation[]{_key, label, page}, phone, email, instagramHandle, cnpj
  },
  "button": *[_id == $pageId][0].headerWhatsApp{label, url}
}`);

export const routes = {
  homePage: "/",
  academias: "/academias",
  clinicasHospitais: "/clinicas-e-hospitais",
  edificioCardioprotegido: "/edificio-cardioprotegido",
  cursos: "/cursos",
};

export function getSiteFrame(pageId: keyof typeof routes) {
  return client.fetch(SITE_FRAME_QUERY, {pageId}, {next: {revalidate: 30}});
}
