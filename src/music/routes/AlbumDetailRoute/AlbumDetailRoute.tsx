import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ListResponse, http } from '~/http';
import { Album, Audio } from '~/types';
import { Card, Container } from '~/ui';
import { useAudioPlayer } from '../../context';

export const AlbumDetailRoute = () => {
  const [album, setAlbum] = React.useState<Album>();
  const [tracks, setTracks] = React.useState<Audio[]>([]);
  const audio = useAudioPlayer();

  const { slug } = useParams();

  React.useEffect(() => {
    http.get<Album>(`/api/albums/${slug}/`).then((album) => {
      setAlbum(album.data);
      http
        .get<ListResponse<Audio>>(`/api/audio/`, {
          params: {
            album_id: album.data.id,
          },
        })
        .then((tracks) => {
          setTracks(tracks.data.results);
        });
    });
  }, []);

  function totalDuration() {
    let reduced = tracks.map((obj) => obj.duration).reduce((a, b) => a + b, 0);
    return displayMins(reduced);
  }

  function display(seconds: number) {
    const minutes = seconds / 60;
    return [minutes, seconds % 60].map((val) => `0${Math.floor(val)}`.slice(-2)).join(':');
  }

  function displayMins(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    return minutes;
  }

  function clickSong(index: number) {
    audio.setPlayQueue(tracks.slice(index));
  }

  if (!album) {
    return null;
  }

  return (
    <>
      <Container>
        <Card className="my-8" fluid>
          <div className="flex align-end gap-8">
            <div>
              <img src={album.thumbnail || ''} alt={album.title} />
            </div>
            <div>
              <h4>Album</h4>
              <h1>{album.title}</h1>
              <div>
                By <Link to={`/artists/${album.artist_slug}`}>{album.artist_name}</Link>
              </div>
              <div>
                {album.release_date} • {tracks.length} songs, {totalDuration()} min
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>
                  <span className="material-symbols-outlined">schedule</span>
                </th>
              </tr>
              {tracks.map((track, index) => (
                <tr key={track.id} onClick={() => clickSong(index)}>
                  <td>{track.track_num}</td>
                  <td>{track.title}</td>
                  <td>{display(track.duration)}</td>
                </tr>
              ))}
            </thead>
          </table>
        </Card>
      </Container>
    </>
  );
};
