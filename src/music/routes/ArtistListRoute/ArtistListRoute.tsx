import React from 'react';
import { Link } from 'react-router-dom';
import { ListResponse, http } from '~/http';
import { Artist } from '~/types';
import { Card, Container } from '~/ui';

export const ArtistListRoute = () => {
  const [artists, setArtists] = React.useState<Artist[]>([]);

  React.useEffect(() => {
    http.get<ListResponse<Artist>>('/api/artists/').then((artists) => {
      setArtists(artists.data.results);
    });
  }, []);

  return (
    <>
      <Container>
        <div className="my-8">
          <Card fluid>
            <h3>Artists</h3>
            <hr />
            <div className="grid grid-columns-4 gap-4">
              {artists.map((artist) => (
                <div key={artist.id}>
                  <img src={artist.thumbnail || ''} alt={artist.name} />
                  <Link to={`/artists/${artist.slug}`}>
                    <h5>{artist.name}</h5>
                  </Link>
                  <p>{artist.genre}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Container>
    </>
  );
};
