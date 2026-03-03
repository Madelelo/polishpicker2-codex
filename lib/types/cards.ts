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
  slug: string;
  difficulty: string;
  tags: string[];
  coverImageUrl: string | null;
  description: string;
};
