export type PolishCard = {
  id: string;
  title: string;
  brand: string;
  finish: string;
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
