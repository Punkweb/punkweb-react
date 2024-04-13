import { Artist } from './Artist';

export type ArtistEvent = {
  id: string;
  thumbnail: string | null;
  created: string;
  modified: string;
  address_line: string | null;
  zip_code: string | null;
  city: string | null;
  state: string | null;
  slug: string;
  title: string;
  venue: string;
  event_date: string;
  event_image: string | null;
  artist: Artist;
};
