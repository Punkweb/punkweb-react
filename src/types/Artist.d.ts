export type Artist = {
  id: string;
  thumbnail: string | null;
  plays_this_week: {
    date: string;
    plays: number;
  }[];
  slug: string;
  name: string;
  genre: string;
  _bio_rendered: string;
  bio: string;
  image: string | null;
  is_listed: boolean;
};
