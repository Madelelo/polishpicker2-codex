import type { NailArtCard, PolishCard } from "@/lib/types/cards";

export type RawPolish = {
  _id: string;
  name?: string | null;
  colorName?: string | null;
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
  tags?: string[] | null;
  techniques?: string[] | null;
  nailArtType?: string | null;
  needPeely?: boolean | null;
  needSponge?: boolean | null;
  needDotter?: boolean | null;
  needBrush?: boolean | null;
  needTape?: boolean | null;
  coverImageUrl?: string | null;
  description?: string | null;
  slug?: string | null;
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
  brand: doc.brand?.trim() || "Unknown brand",
  finish: doc.finish?.trim() || doc.polishType?.trim() || "Unspecified",
  colorHex: doc.colorHex?.trim() || doc.color?.trim() || null,
  imageUrl: doc.imageUrl?.trim() || null,
  slug: normalizeSlug(doc.slug, doc._id)
});

export const mapNailArtCard = (doc: RawNailArt): NailArtCard => {
  const tags = new Set<string>();

  for (const tag of [...(doc.tags ?? []), ...(doc.techniques ?? [])]) {
    const normalized = tag?.trim();
    if (normalized) {
      tags.add(normalized);
    }
  }

  if (doc.nailArtType?.trim()) {
    tags.add(doc.nailArtType.trim());
  }
  if (doc.needPeely) tags.add("needs peely");
  if (doc.needSponge) tags.add("needs sponge");
  if (doc.needDotter) tags.add("needs dotter");
  if (doc.needBrush) tags.add("needs brush");
  if (doc.needTape) tags.add("needs tape");

  return {
    id: doc._id,
    title: doc.title?.trim() || doc.nailArt?.trim() || "Untitled nail art",
    slug: normalizeSlug(doc.slug, doc._id),
    difficulty: doc.difficulty?.trim() || "Unknown",
    tags: [...tags],
    coverImageUrl: doc.coverImageUrl?.trim() || null,
    description: doc.description?.trim() || ""
  };
};
