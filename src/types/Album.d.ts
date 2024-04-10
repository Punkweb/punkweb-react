export type Album = {
  id: string;
  artist_slug: string;
  artist_name: string;
  thumbnail: string | null;
  total_song_plays: number;
  slug: string;
  title: string;
  release_date: string;
  cover_art: string | null;
  genre: string;
  record_label_tag: string | null;
  _youtube_tag_rendered: string;
  youtube_tag: string;
  is_listed: boolean;
  artist: string;
};
