import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '~/auth';
import { Avatar, Button, Container, IconButton } from '~/ui';
import './Nav.scss';

export const Nav = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();

  function handleLogout() {
    logout().then(() => {
      setUser(undefined);
      navigate('/login');
    });
  }

  return (
    <nav className="Nav">
      <Container>
        <div className="Nav__content">
          <Link to="/">
            <h1 className="m-0">Punkweb</h1>
          </Link>
          <Link to="/">
            <Button color="primary" size="sm">
              Music
            </Button>
          </Link>
          <a href="/board/">
            <Button color="primary" size="sm">
              Forum
            </Button>
          </a>
          <div className="Nav__spacer"></div>
          {user ? (
            <>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Avatar user={user} size="xs" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="end" className="DropdownMenu__content" sideOffset={4}>
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => navigate('/profile')}>
                      <div className="DropdownMenu__icon">
                        <span className="material-symbols-outlined">person</span>
                      </div>
                      Profile
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => handleLogout()}>
                      <div className="DropdownMenu__icon">
                        <span className="material-symbols-outlined">logout</span>
                      </div>
                      Logout
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </>
          ) : (
            <>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <IconButton>
                    <span className="material-symbols-outlined">menu</span>
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="end" className="DropdownMenu__content" sideOffset={4}>
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => navigate('/signup')}>
                      <div className="DropdownMenu__icon">
                        <span className="material-symbols-outlined">person_add</span>
                      </div>
                      Sign Up
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => navigate('/login')}>
                      <div className="DropdownMenu__icon">
                        <span className="material-symbols-outlined">login</span>
                      </div>
                      Login
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </>
          )}
        </div>
      </Container>
    </nav>
  );
};
