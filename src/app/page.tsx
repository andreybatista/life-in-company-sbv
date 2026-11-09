import {ImportanceSection} from '@/components/importance-section';
import {TextImageSection} from "@/components/text-image-section";
import type {HOME_PAGE_QUERY_RESULT} from "../../sanity.types";
import {Hero} from "@/components/hero";
import {createImageUrlBuilder} from "@sanity/image-url";
import {defineQuery} from "next-sanity";
import {SiteFrame} from "@/components/site-frame";
import {client} from "@/sanity/client";


const HOME_PAGE_QUERY = defineQuery(`*[_id == "homePage" && _type == "homePage"][0]{
  "id": sectionIds.hero, eyebrow, title, description, mainImage,
  primaryLabel, link, secondaryLabel, secondaryLink,
  "historyId": sectionIds.history, history{eyebrow, title, body, image, simulation, lecture},
  "importanceId": sectionIds.importance, importance{eyebrow, statement, description}
}`);

type HomeImage = NonNullable<HOME_PAGE_QUERY_RESULT>["mainImage"];
const images = createImageUrlBuilder(client);

function croppedPhoto(photo: HomeImage | undefined, width: number, height: number) {
  if (!photo?.asset) return undefined;
  return {
    src: images.image(photo).width(width).height(height).fit("crop").auto("format").url(),
    alt: photo.alt ?? "",
    width,
    height,
  };
}

export default async function Home() {
  const page = await client.fetch(HOME_PAGE_QUERY, {}, {next: {revalidate: 30}});
  const history = page?.history;
  return (
    <SiteFrame pageId="homePage">
      <main>
        <Hero
          id={page?.id}
          eyebrow={page?.eyebrow}
          title={page?.title ?? "Life in Company SBV"}
          description={page?.description}
          image={croppedPhoto(page?.mainImage, 960, 1006)}
          primary={{label: page?.primaryLabel ?? "Saiba mais", href: page?.link}}
          secondary={{label: page?.secondaryLabel, href: page?.secondaryLink}}
        />
        {history && (
          <TextImageSection
            id={page?.historyId}
            eyebrow={history.eyebrow}
            title={history.title}
            body={history.body}
            mainImage={croppedPhoto(history.image, 720, 870)}
            secondaryImages={[
              croppedPhoto(history.simulation, 330, 336),
              croppedPhoto(history.lecture, 330, 336),
            ]}
          />
        )}
        {page?.importance && (
          <ImportanceSection id={page.importanceId} {...page.importance} />
        )}
      </main>
    </SiteFrame>
  );
}
