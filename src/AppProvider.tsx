import * as Tooltip from '@radix-ui/react-tooltip';
import { AuthProvider } from './auth';
import { AudioPlayerProvider } from './music';

export type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <>
      <AuthProvider>
        <Tooltip.Provider>
          <AudioPlayerProvider>{children}</AudioPlayerProvider>
        </Tooltip.Provider>
      </AuthProvider>
    </>
  );
};
