export type Album = {
  id: string;
  artist_slug: string;
  artist_name: string;
  thumbnail: string | null;
  slug: string;
  title: string;
  release_date: string;
  cover_art: string | null;
  genre: string;
  is_listed: boolean;
  artist: string;
};
