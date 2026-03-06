import groq from "groq";
import { sanityClient } from "@/lib/sanity/client";
import { isSanityConfigured } from "@/lib/sanity/env";
import { mapNailArtCard, mapPolishCard } from "@/lib/sanity/mappers";
import type { RawNailArt, RawPolish } from "@/lib/sanity/mappers";
import type { NailArtCard, PolishCard } from "@/lib/types/cards";

export type SanityConnectionStatus =
  | {
      state: "not-configured";
      message: string;
    }
  | {
      state: "connected";
      message: string;
    }
  | {
      state: "error";
      message: string;
    };

const POLISH_QUERY = groq`*[_type == "polish" && coalesce(active, true) == true] | order(lower(brand) asc, lower(name) asc) {
  _id,
  name,
  "colorName": coalesce(colorName, name, color),
  color,
  colorType,
  brand,
  finish,
  "polishType": coalesce(polishType->polishType, polishType->title, polishType, finish),
  "slug": slug.current,
  "colorHex": coalesce(colorValue.hex, color.hex, colorHex),
  "imageUrl": coalesce(swatch.asset->url, image.asset->url)
}`;

const LEGACY_POLISH_QUERY = groq`*[_type == "nailpolish" && coalesce(active, true) == true] | order(lower(brand) asc, lower(colorName) asc) {
  _id,
  "name": coalesce(name, colorName),
  "colorName": coalesce(colorName, name, color),
  color,
  colorType,
  brand,
  finish,
  "polishType": coalesce(polishType->polishType, polishType->title, polishType, finish),
  "colorHex": colorValue.hex
}`;

const NAIL_ART_QUERY = groq`*[_type == "nailArt" && coalesce(active, true) == true] | order(_createdAt desc) {
  _id,
  title,
  nailArt,
  difficulty,
  "description": coalesce(description, caption),
  nailArtType,
  "polishRequired": coalesce(polishRequired[]->polishType, polishReq[]->polishType, []),
  needPeely,
  needSponge,
  needDotter,
  needBrush,
  needTape,
  "coverImageUrl": coalesce(coverImage.asset->url, image.asset->url)
}`;

const LEGACY_NAIL_ART_QUERY = groq`*[_type == "nailart" && coalesce(active, true) == true] | order(_createdAt desc) {
  _id,
  nailArt,
  nailArtType,
  "polishRequired": coalesce(polishRequired[]->polishType, polishReq[]->polishType, []),
  description,
  needPeely,
  needSponge,
  needDotter,
  needBrush,
  needTape,
  tutorialLink
}`;

const SANITY_HEALTH_QUERY = groq`count(*[_type in ["polish", "nailpolish", "nailArt", "nailart"]])`;

const warnMissingConfig = (() => {
  let didWarn = false;

  return () => {
    if (!didWarn) {
      console.warn(
        "Sanity env vars are not configured. Returning empty lists for catalog queries."
      );
      didWarn = true;
    }
  };
})();

export const getSanityConnectionStatus =
  async (): Promise<SanityConnectionStatus> => {
    if (!isSanityConfigured) {
      return {
        state: "not-configured",
        message:
          "Sanity is not configured. Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET."
      };
    }

    try {
      await sanityClient.fetch<number>(SANITY_HEALTH_QUERY);
      return {
        state: "connected",
        message: "Connected to Sanity dataset."
      };
    } catch (error) {
      console.error("Sanity health check failed", error);
      return {
        state: "error",
        message:
          "Could not reach Sanity. Check project ID, dataset, token, and network/DNS access."
      };
    }
  };

export const getPolishes = async (): Promise<PolishCard[]> => {
  if (!isSanityConfigured) {
    warnMissingConfig();
    return [];
  }

  try {
    const [modernDocs, legacyDocs] = await Promise.all([
      sanityClient.fetch<RawPolish[]>(POLISH_QUERY),
      sanityClient.fetch<RawPolish[]>(LEGACY_POLISH_QUERY)
    ]);
    return [...modernDocs, ...legacyDocs].map((doc) => mapPolishCard(doc));
  } catch (error) {
    console.error("Failed to fetch polish docs from Sanity", error);
    return [];
  }
};

export const getNailArt = async (): Promise<NailArtCard[]> => {
  if (!isSanityConfigured) {
    warnMissingConfig();
    return [];
  }

  try {
    const [modernDocs, legacyDocs] = await Promise.all([
      sanityClient.fetch<RawNailArt[]>(NAIL_ART_QUERY),
      sanityClient.fetch<RawNailArt[]>(LEGACY_NAIL_ART_QUERY)
    ]);
    return [...modernDocs, ...legacyDocs].map((doc) => mapNailArtCard(doc));
  } catch (error) {
    console.error("Failed to fetch nail-art docs from Sanity", error);
    return [];
  }
};
