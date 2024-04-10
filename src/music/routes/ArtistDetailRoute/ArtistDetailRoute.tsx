import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ListResponse, http } from '~/http';
import { useAudioPlayer } from '~/music';
import { Album, Artist, Audio } from '~/types';
import { Button, Card, Container, TabItem, Tabs } from '~/ui';
import './ArtistDetailRoute.scss';
import clsx from 'clsx';

export const ArtistDetailRoute = () => {
  const [artist, setArtist] = React.useState<Artist>();
  const [albums, setAlbums] = React.useState<Album[]>([]);
  const [top10, setTop10] = React.useState<Audio[]>([]);

  const { slug } = useParams();
  const audio = useAudioPlayer();

  React.useEffect(() => {
    if (!slug) {
      return;
    }
    http.get<Artist>(`/api/artists/${slug}/`).then((artist) => {
      setArtist(artist.data);

      http
        .get<ListResponse<Album>>(`/api/albums/`, {
          params: {
            artist_id: artist.data.id,
          },
        })
        .then((albums) => {
          setAlbums(albums.data.results);
        });

      http.get<Audio[]>(`/api/artists/${slug}/top_10/`).then((top10) => {
        setTop10(top10.data);
      });
    });
  }, [slug]);

  function clickMainPlay() {
    audio.setPlayQueue(top10.slice(0));
  }

  function clickTrack(index: number) {
    audio.setPlayQueue(top10.slice(index));
  }

  if (!artist) {
    return;
  }

  return (
    <>
      <Container>
        <Card className="my-8 p-0">
          <div className="ArtistDetailRoute">
            <div className="ArtistDetailRoute__header">
              <div className="ArtistDetailRoute__image">
                <img src={artist.image || ''} alt={artist.name} />
              </div>
              <div className="ArtistDetailRoute__header__content">
                <h1 className="ArtistDetailRoute__header__name">{artist.name}</h1>
                <Button className="mb-4" color="primary" onClick={clickMainPlay} size="lg" variant="raised">
                  Play
                </Button>
                <Tabs>
                  <TabItem active>Music</TabItem>
                  {/* <TabItem>About</TabItem>
                  <TabItem>Events</TabItem> */}
                </Tabs>
              </div>
            </div>
            <div className="ArtistDetailRoute__content">
              <h3>Popular</h3>
              <ul className="ArtistDetailRoute__topTracks">
                {top10.map((track, index) => (
                  <li
                    key={track.id}
                    className={clsx({
                      'ArtistDetailRoute__topTracks--active': track.id === audio.playQueue[0]?.id,
                    })}
                    onClick={() => clickTrack(index)}
                  >
                    <img src={track.album_thumbnail || ''} alt={track.title} />
                    <div>{index + 1}</div>
                    <div className="flex-1">{track.title}</div>
                    <div>{track.total_plays}</div>
                  </li>
                ))}
              </ul>
              <h3>Albums</h3>
              <hr />
              <div className="grid grid-columns-4">
                {albums.map((album) => (
                  <div key={album.id}>
                    <img src={album.thumbnail || ''} alt={album.title} />
                    <Link to={`/albums/${album.slug}`}>
                      <h5>{album.title}</h5>
                    </Link>
                    <p>{album.release_date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </>
  );
};
