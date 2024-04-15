import React from 'react';
import { Link } from 'react-router-dom';
import { ListResponse, http } from '~/http';
import { Artist } from '~/types';
import { Card, Container, Spinner } from '~/ui';
import './ArtistListRoute.scss';

export const ArtistListRoute = () => {
  const [artists, setArtists] = React.useState<Artist[]>([]);
  const [artistsLoading, setArtistsLoading] = React.useState(true);

  React.useEffect(() => {
    setArtistsLoading(true);
    http
      .get<ListResponse<Artist>>('/api/artists/')
      .then((artists) => {
        setArtists(artists.data.results);
      })
      .finally(() => {
        setArtistsLoading(false);
      });
  }, []);

  return (
    <>
      <Container>
        <div className="my-8">
          <Card fluid>
            <h3>Artists</h3>
            <hr />
            {artistsLoading ? (
              <Spinner message="Loading artists..." />
            ) : (
              <div className="ArtistListRoute__list">
                {artists.map((artist) => (
                  <div key={artist.id}>
                    <Link to={`/artists/${artist.slug}`}>
                      <img src={artist.thumbnail || ''} alt={artist.name} />
                      <h5>{artist.name}</h5>
                    </Link>
                    <p>{artist.genre}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </Container>
    </>
  );
};
