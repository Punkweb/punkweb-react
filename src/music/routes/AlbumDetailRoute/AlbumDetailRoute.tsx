import clsx from 'clsx';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ListResponse, http } from '~/http';
import { Album, Audio } from '~/types';
import { Card, Container } from '~/ui';
import { useAudioPlayer } from '../../context';
import './AlbumDetailRoute.scss';

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
          <div className="AlbumDetailRoute__header">
            <div>
              <img src={album.thumbnail || ''} alt={album.title} />
            </div>
            <div>
              <h4>Album</h4>
              <h1>{album.title}</h1>
              <div>
                By <Link to={`/artists/${album.artist.slug}`}>{album.artist.name}</Link>
              </div>
              <div>
                {album.release_date} • {tracks.length} songs, {totalDuration()} min
              </div>
            </div>
          </div>
          <table className="AlbumDetailRoute__table">
            <colgroup>
              <col width="50px" />
              <col />
              <col width="100px" />
            </colgroup>
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th>Title</th>
                <th className="text-center">
                  <span className="material-symbols-outlined">schedule</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track, index) => (
                <tr
                  key={track.id}
                  className={clsx({
                    'AlbumDetailRoute__table--active': audio.playQueue[0]?.id === track.id,
                  })}
                  onClick={() => clickSong(index)}
                >
                  <td>{track.track_num}</td>
                  <td>{track.title}</td>
                  <td>{display(track.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Container>
    </>
  );
};
