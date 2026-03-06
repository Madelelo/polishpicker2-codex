export type PolishCard = {
  id: string;
  title: string;
  colorName: string;
  color: string | null;
  colorType: string | null;
  brand: string;
  finish: string;
  polishType: string | null;
  colorHex: string | null;
  imageUrl: string | null;
  slug: string;
};

export type NailArtCard = {
  id: string;
  title: string;
  difficulty: string;
  nailArtType: string | null;
  toolsNeeded: string[];
  polishRequired: string[];
  coverImageUrl: string | null;
  description: string;
};
