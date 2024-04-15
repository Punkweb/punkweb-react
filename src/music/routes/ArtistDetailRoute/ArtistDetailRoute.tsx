import clsx from 'clsx';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ListResponse, http } from '~/http';
import { Album, Artist, Audio } from '~/types';
import { Button, Card, Container, Spinner, TabItem, Tabs } from '~/ui';
import { useAudioPlayer } from '../../context';
import './ArtistDetailRoute.scss';
import { formatDateString } from '~/utils/dateString';

export const ArtistDetailRoute = () => {
  const [artist, setArtist] = React.useState<Artist>();
  const [albums, setAlbums] = React.useState<Album[]>([]);
  const [albumsLoading, setAlbumsLoading] = React.useState(true);
  const [top10, setTop10] = React.useState<Audio[]>([]);
  const [top10Loading, setTop10Loading] = React.useState(true);
  const [showMoreSongs, setShowMoreSongs] = React.useState(false);

  const { slug } = useParams();
  const audio = useAudioPlayer();

  React.useEffect(() => {
    if (!slug) {
      return;
    }
    http.get<Artist>(`/api/artists/${slug}/`).then((artist) => {
      setArtist(artist.data);

      setAlbumsLoading(true);
      http
        .get<ListResponse<Album>>(`/api/albums/`, {
          params: {
            artist_id: artist.data.id,
          },
        })
        .then((albums) => {
          setAlbums(albums.data.results);
        })
        .finally(() => {
          setAlbumsLoading(false);
        });

      setTop10Loading(true);
      http
        .get<Audio[]>(`/api/artists/${slug}/top_10/`)
        .then((top10) => {
          setTop10(top10.data);
        })
        .finally(() => {
          setTop10Loading(false);
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
    return (
      <Container>
        <Spinner className="mt-8" message="Loading..." />
      </Container>
    );
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
              <h3 className="mb-4">Popular</h3>
              {top10Loading ? (
                <Spinner message="Loading popular tracks..." />
              ) : (
                <>
                  <ul className="ArtistDetailRoute__topTracks">
                    {top10.slice(0, showMoreSongs ? 10 : 5).map((track, index) => (
                      <li
                        key={track.id}
                        className={clsx({
                          'ArtistDetailRoute__topTracks--active': track.id === audio.playQueue[0]?.id,
                        })}
                        onClick={() => clickTrack(index)}
                      >
                        <img src={track.album.thumbnail || ''} alt={track.title} />
                        <div>{index + 1}</div>
                        <div className="flex-1">{track.title}</div>
                        <div>{track.total_plays}</div>
                      </li>
                    ))}
                  </ul>
                  {top10 && top10.length > 5 && (
                    <Button
                      className="mt-4"
                      color="primary"
                      onClick={() => {
                        setShowMoreSongs(!showMoreSongs);
                      }}
                      variant="ghost"
                    >
                      Show {showMoreSongs ? 'Less' : 'More'}
                    </Button>
                  )}
                </>
              )}
              <h3 className="my-4">Albums</h3>
              <hr />
              {albumsLoading ? (
                <Spinner message="Loading albums..." />
              ) : (
                <div className="ArtistDetailRoute__albums">
                  {albums.map((album) => (
                    <div key={album.id}>
                      <Link to={`/albums/${album.slug}`}>
                        <img src={album.thumbnail || ''} alt={album.title} />
                        <h5>{album.title}</h5>
                      </Link>
                      <p>{formatDateString(album.release_date, 'yyyy-MM-dd', 'yyyy')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </Container>
    </>
  );
};
