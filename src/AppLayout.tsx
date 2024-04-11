import { Outlet } from 'react-router-dom';
import './AppLayout.scss';
import { Nav } from './components';
import { AudioPlayer } from './music';

export const AppLayout = () => {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main className="main">
        <Outlet />
      </main>
      <AudioPlayer />
    </>
  );
};
