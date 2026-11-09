import {Schools, Founder, Conversion} from '@/components/home-sections';
import Image from 'next/image';
import {MethodsSection} from '@/components/methods-section';
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
  "importanceId": sectionIds.importance, importance{eyebrow, statement, description},
  "purposeId": sectionIds.purpose, purpose{eyebrow, statement},
  "processId": sectionIds.process, process{eyebrow, methods[]{_key, title, description, "icon": icon.asset->url, "alt": icon.alt}},
  "schoolsId": sectionIds.schools, schools{eyebrow,title,image,legalNotice,description,topics,context,formatsTitle,formats[]{_key,title,description,button{label,href}}},
  "teamId": sectionIds.team, team{eyebrow,name,credentials,biography,portrait},
  "contactId": sectionIds.contact, contact{statement,button{label,href}},
  "solutionsId": sectionIds.solutions, solutions{eyebrow, areas[]{_key, title, description, image, button{label, href}}}
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
        {(page?.purpose?.eyebrow || page?.purpose?.statement) && (
          <section
            id={page.purposeId ?? undefined}
            aria-label={page.purpose.eyebrow || page.purpose.statement || undefined}
            className="bg-background px-[6%] py-[clamp(3rem,5vw,4.5rem)] text-center text-foreground"
          >
            {page.purpose.eyebrow && (
              <p className="text-eyebrow font-bold uppercase text-accent">{page.purpose.eyebrow}</p>
            )}
            {page.purpose.statement && (
              <h2 className="mx-auto max-w-[80rem] text-[clamp(1.5rem,2.35vw,2.125rem)] leading-tight font-bold text-balance whitespace-pre-line wrap-break-word not-first:mt-5">
                {page.purpose.statement}
              </h2>
            )}
          </section>
        )}
        {page?.process && <MethodsSection id={page.processId} content={page.process} />}
        {page?.schools && <Schools id={page.schoolsId} data={page.schools} photo={croppedPhoto(page.schools.image, 786, 596)} />}
        {!!page?.solutions?.areas?.length && (
          <section id={page.solutionsId ?? undefined} aria-label={page.solutions.eyebrow || "Áreas de atuação"} className="bg-sand text-foreground">
            <div className="mx-auto max-w-[90rem] px-[5%] py-[clamp(3rem,5vw,5rem)]">
              {page.solutions.eyebrow && <h2 className="mb-9 text-eyebrow font-bold uppercase text-accent">{page.solutions.eyebrow}</h2>}
              <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {page.solutions.areas.map(area => {
                  const photo = croppedPhoto(area.image, 840, 450);
                  const href = area.button?.href;
                  return (
                    <li key={area._key} className="flex flex-col overflow-hidden rounded-2xl bg-background">
                      {photo && <Image {...photo} className="h-auto w-full" unoptimized />}
                      <div className="flex flex-1 flex-col gap-4 p-6">
                        {area.title && <h3 className="text-2xl leading-tight font-bold">{area.title}</h3>}
                        {area.description && <p className="whitespace-pre-line">{area.description}</p>}
                        {area.button?.label && href && /^(?:https?:\/\/|\/(?![\/\\])|#)/i.test(href) && (
                          <a href={href} className="mt-auto inline-flex min-h-12 items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-bold text-accent hover:underline focus-visible:outline-foreground">
                            {area.button.label} <span aria-hidden="true">→</span>
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}
        {page?.team && <Founder id={page.teamId} data={page.team} photo={croppedPhoto(page.team.portrait, 580, 856)} />}
        {page?.contact && <Conversion id={page.contactId} data={page.contact} />}
      </main>
    </SiteFrame>
  );
}
