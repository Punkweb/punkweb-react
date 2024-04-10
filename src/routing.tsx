import { Navigate, RouteObject } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { LoginRoute, ProfileRoute, SignUpRoute, useAuth } from './auth';
import { AlbumDetailRoute, ArtistDetailRoute, ArtistListRoute } from './music';

export type RouteGuard = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: RouteGuard) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export const PublicRoute = ({ children }: RouteGuard) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <ArtistListRoute />,
      },
      {
        path: '/artists/:slug',
        element: <ArtistDetailRoute />,
      },
      {
        path: '/albums/:slug',
        element: <AlbumDetailRoute />,
      },
      {
        path: '/login',
        element: (
          <PublicRoute>
            <LoginRoute />
          </PublicRoute>
        ),
      },
      {
        path: '/signup',
        element: (
          <PublicRoute>
            <SignUpRoute />
          </PublicRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfileRoute />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
