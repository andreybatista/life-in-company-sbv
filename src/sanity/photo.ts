import {createImageUrlBuilder} from '@sanity/image-url';
import type {HOME_PAGE_QUERY_RESULT} from '../../sanity.types';
import {client} from './client';

type HomeImage = NonNullable<HOME_PAGE_QUERY_RESULT>["mainImage"];
const images = createImageUrlBuilder(client);

export function croppedPhoto(photo: Omit<NonNullable<HomeImage>, "_type"> | null | undefined, width: number, height: number) {
  if (!photo?.asset) return undefined;
  return {
    src: images.image(photo).width(width).height(height).fit("crop").auto("format").url(),
    alt: photo.alt ?? "",
    width,
    height,
  };
}
