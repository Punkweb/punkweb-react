export type Artist = {
  id: string;
  thumbnail: string | null;
  slug: string;
  name: string;
  genre: string;
  _bio_rendered: string;
  bio: string;
  image: string | null;
  is_listed: boolean;
};
