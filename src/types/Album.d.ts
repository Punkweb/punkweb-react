import { Artist } from './Artist';

export type Album = {
  id: string;
  thumbnail: string | null;
  slug: string;
  title: string;
  release_date: string;
  cover_art: string | null;
  genre: string;
  is_listed: boolean;
  artist: Artist;
};
