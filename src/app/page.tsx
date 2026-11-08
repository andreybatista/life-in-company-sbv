import Image from "next/image";
import { createImageUrlBuilder } from "@sanity/image-url";
import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";

const HOME_PAGE_QUERY = defineQuery(`*[_id == "homePage" && _type == "homePage"][0]{title, description, mainImage, link}`);

export default async function Home() {
  const page = await client.fetch(HOME_PAGE_QUERY, {}, { next: { revalidate: 30 } });

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-20">
      <h1 className="text-4xl font-semibold">{page?.title ?? "Life in Company SBV"}</h1>
      {page?.mainImage?.asset && (
        <Image
          className="mt-6 h-auto w-full rounded-lg"
          src={createImageUrlBuilder(client).image(page.mainImage).width(1280).height(720).fit("crop").auto("format").url()}
          width={1280}
          height={720}
          alt={page.mainImage.alt ?? ""}
          unoptimized
        />
      )}
      {page?.description && <p className="mt-6 text-lg">{page.description}</p>}
      {page?.link && /^https?:\/\//i.test(page.link) && (
        <a className="mt-6 inline-block rounded-md bg-foreground px-5 py-3 text-background" href={page.link}>
          Saiba mais
        </a>
      )}
    </main>
  );
}

