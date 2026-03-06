import type { NailArtCard, PolishCard } from "@/lib/types/cards";

export type RawPolish = {
  _id: string;
  name?: string | null;
  colorName?: string | null;
  colorType?: string | null;
  brand?: string | null;
  finish?: string | null;
  polishType?: string | null;
  colorHex?: string | null;
  color?: string | null;
  imageUrl?: string | null;
  slug?: string | null;
};

export type RawNailArt = {
  _id: string;
  title?: string | null;
  nailArt?: string | null;
  difficulty?: string | null;
  nailArtType?: string | null;
  polishRequired?: string[] | null;
  needPeely?: boolean | null;
  needSponge?: boolean | null;
  needDotter?: boolean | null;
  needBrush?: boolean | null;
  needTape?: boolean | null;
  coverImageUrl?: string | null;
  description?: string | null;
};

const normalizeSlug = (slug: string | null | undefined, id: string): string => {
  if (slug && slug.trim().length > 0) {
    return slug.trim();
  }
  return id;
};

export const mapPolishCard = (doc: RawPolish): PolishCard => ({
  id: doc._id,
  title: doc.name?.trim() || doc.colorName?.trim() || "Untitled polish",
  colorName: doc.colorName?.trim() || doc.name?.trim() || "Unknown color",
  color: doc.color?.trim() || null,
  colorType: doc.colorType?.trim() || null,
  brand: doc.brand?.trim() || "Unknown brand",
  finish: doc.finish?.trim() || doc.polishType?.trim() || "Unspecified",
  polishType: doc.polishType?.trim() || null,
  colorHex: doc.colorHex?.trim() || null,
  imageUrl: doc.imageUrl?.trim() || null,
  slug: normalizeSlug(doc.slug, doc._id)
});

export const mapNailArtCard = (doc: RawNailArt): NailArtCard => {
  const toolsNeeded: string[] = [];
  if (doc.needPeely) toolsNeeded.push("Peely base");
  if (doc.needSponge) toolsNeeded.push("Sponge");
  if (doc.needDotter) toolsNeeded.push("Dotting tool");
  if (doc.needBrush) toolsNeeded.push("Detail brush");
  if (doc.needTape) toolsNeeded.push("Tape");

  const polishRequired = (doc.polishRequired ?? [])
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  return {
    id: doc._id,
    title: doc.title?.trim() || doc.nailArt?.trim() || "Untitled nail art",
    difficulty: doc.difficulty?.trim() || "Unknown",
    nailArtType: doc.nailArtType?.trim() || null,
    toolsNeeded,
    polishRequired,
    coverImageUrl: doc.coverImageUrl?.trim() || null,
    description: doc.description?.trim() || ""
  };
};
