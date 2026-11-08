import {Hero} from "@/components/hero";
import {createImageUrlBuilder} from "@sanity/image-url";
import {defineQuery} from "next-sanity";
import {SiteFrame} from "@/components/site-frame";
import {client} from "@/sanity/client";


const HOME_PAGE_QUERY = defineQuery(`*[_id == "homePage" && _type == "homePage"][0]{
  "id": sectionIds.hero, eyebrow, title, description, mainImage,
  primaryLabel, link, secondaryLabel, secondaryLink
}`);

export default async function Home() {
  const page = await client.fetch(HOME_PAGE_QUERY, {}, {next: {revalidate: 30}});
  const photo = page?.mainImage;
  return (
    <SiteFrame pageId="homePage">
      <main>
        <Hero
          id={page?.id}
          eyebrow={page?.eyebrow}
          title={page?.title ?? "Life in Company SBV"}
          description={page?.description}
          image={photo?.asset ? {
            src: createImageUrlBuilder(client).image(photo).width(960).height(1006).fit("crop").auto("format").url(),
            alt: photo.alt ?? "",
          } : undefined}
          primary={{label: page?.primaryLabel ?? "Saiba mais", href: page?.link}}
          secondary={{label: page?.secondaryLabel, href: page?.secondaryLink}}
        />
      </main>
    </SiteFrame>
  );
}
