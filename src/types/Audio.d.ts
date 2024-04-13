import { Album } from './Album';

export type Audio = {
  id: string;
  duration: number;
  total_plays: number;
  uploaded_at: string;
  slug: string;
  title: string;
  disc_num: number;
  track_num: number;
  _bbcode_lyrics_rendered: string;
  bbcode_lyrics: string;
  file: string;
  album: Album;
};
