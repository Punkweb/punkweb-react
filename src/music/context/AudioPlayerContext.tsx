import React from 'react';
import { Audio as PunkwebAudio } from '~/types';

export type AudioPlayerContextType = {
  back: () => void;
  currentTime: number;
  duration: number;
  instance: HTMLAudioElement | undefined;
  next: () => void;
  playQueue: PunkwebAudio[];
  setPlayQueue: React.Dispatch<React.SetStateAction<PunkwebAudio[]>>;
  setTime: (time: number) => void;
};

export const AudioPlayerContext = React.createContext<AudioPlayerContextType | undefined>(undefined);

export type AudioPlayerProviderProps = {
  children: React.ReactNode;
};

export const AudioPlayerProvider = ({ children }: AudioPlayerProviderProps) => {
  const [instance, setInstance] = React.useState<HTMLAudioElement>();
  const [playQueue, setPlayQueue] = React.useState<PunkwebAudio[]>([]);
  const [history, setHistory] = React.useState<PunkwebAudio[]>([]);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  React.useEffect(() => {
    createAudio();
  }, []);

  React.useEffect(() => {
    if (!instance) {
      return;
    }

    if (playQueue.length === 0) {
      stop();
      setHistory([]);
      return;
    }

    load(playQueue[0].file);

    if ('mediaSession' in navigator) {
      const track = playQueue[0];

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.album.artist.name,
        album: track.album.title,
        artwork: [
          {
            src: track.album.cover_art || '',
          },
          {
            src: track.album.thumbnail || '',
          },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => {
        instance?.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        instance?.pause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', back);
      navigator.mediaSession.setActionHandler('nexttrack', next);
    }
  }, [playQueue]);

  function createAudio() {
    const audio = new Audio();
    audio.addEventListener('canplaythrough', () => {
      audio.play();
    });
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    });
    audio.addEventListener('ended', () => {
      setHistory([...history, playQueue[0]]);
      setPlayQueue((prevPlayQueue) => prevPlayQueue.slice(1));
    });
    setInstance(audio);
  }

  function stop() {
    if (!instance) {
      return;
    }
    instance.pause();
    instance.src = '';
  }

  function load(src: string) {
    if (!instance) {
      return;
    }
    instance.src = src;
    instance.load();
  }

  function back() {
    if (history.length < 1) {
      return;
    }

    const previous = history[history.length - 1];

    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
    setPlayQueue([previous, ...playQueue]);
  }

  function next() {
    setHistory([...history, playQueue[0]]);
    setPlayQueue((prevPlayQueue) => prevPlayQueue.slice(1));
  }

  function setTime(time: number) {
    if (!instance) {
      return;
    }
    instance.currentTime = time;
  }

  return (
    <AudioPlayerContext.Provider
      value={{
        back,
        currentTime,
        duration,
        instance,
        next,
        playQueue,
        setPlayQueue,
        setTime,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = React.useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
