import React from 'react';
import { Audio as AudioType } from '~/types';

export type AudioPlayerContextType = {
  back: () => void;
  currentTime: number;
  duration: number;
  instance: React.MutableRefObject<HTMLAudioElement | undefined>;
  pause: () => void;
  play: () => void;
  playQueue: AudioType[];
  next: () => void;
  setPlayQueue: (playQueue: AudioType[]) => void;
  setTime: (time: number) => void;
  trackPercent: number;
};

export const AudioPlayerContext = React.createContext<AudioPlayerContextType | undefined>(undefined);

export type AudioPlayerProviderProps = {
  children: React.ReactNode;
};

export const AudioPlayerProvider = ({ children }: AudioPlayerProviderProps) => {
  const [playQueue, setPlayQueue] = React.useState<AudioType[]>([]);
  const [events, setEvents] = React.useState<any[]>([]);
  const [history, setHistory] = React.useState<AudioType[]>([]);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [trackPercent, setTrackPercent] = React.useState(0);

  const instance = React.useRef<HTMLAudioElement>();

  React.useEffect(() => {
    if (playQueue.length === 0) {
      destroyAudio();
      return;
    }

    load(playQueue[0].file);
  }, [playQueue]);

  function destroyAudio() {
    if (!instance.current) {
      return;
    }
    pause();
    for (let i = 0; i < events.length; i++) {
      instance.current.removeEventListener(events[i].name, events[i].callback);
      events.splice(i, 1);
      setEvents(events);
    }
    try {
      instance.current.src = '';
    } finally {
      instance.current = undefined;
    }
  }

  function createAudio() {
    if (!instance.current) {
      instance.current = new Audio();
      // instance.current.crossOrigin = 'anonymous';
      instance.current.preload = 'metadata';
      bind('canplaythrough', () => {
        play();
      });
      bind('ended', () => {
        setHistory([...history, playQueue[0]]);
        setPlayQueue((prevPlayQueue) => prevPlayQueue.slice(1));
      });
      bind('timeupdate', () => {
        if (!instance.current) {
          return;
        }
        setCurrentTime(instance.current.currentTime);
        setDuration(instance.current.duration);
        setTrackPercent((instance.current.currentTime / instance.current.duration) * 100);
      });
    }
  }

  function load(file: string) {
    destroyAudio();
    createAudio();
    if (!instance.current) {
      return;
    }
    instance.current.pause();
    instance.current.src = file;
    instance.current.load();
  }

  function pause() {
    if (!instance.current) {
      return;
    }
    instance.current.pause();
  }

  function play() {
    if (!instance.current) {
      return;
    }
    instance.current.play();
  }

  function back() {
    if (history.length < 1) {
      return;
    }
    setHistory((prevHistory) => {
      const previous = prevHistory[prevHistory.length - 1];
      if (!previous) {
        return prevHistory;
      }
      setPlayQueue((prevPlayQueue) => [previous, ...prevPlayQueue]);
      return prevHistory.slice(0, prevHistory.length - 1);
    });
  }

  function next() {
    setHistory([...history, playQueue[0]]);
    setPlayQueue((prevPlayQueue) => prevPlayQueue.slice(1));
  }

  function setTime(time: number) {
    if (!instance.current) {
      return;
    }
    instance.current.currentTime = time;
  }

  function bind(eventName: string, eventCallback: any) {
    if (!instance.current) {
      return;
    }
    setEvents([...events, { name: eventName, callback: eventCallback }]);
    instance.current.addEventListener(eventName, eventCallback);
  }

  return (
    <AudioPlayerContext.Provider
      value={{
        back,
        currentTime,
        duration,
        instance,
        next,
        pause,
        play,
        playQueue,
        setPlayQueue,
        setTime,
        trackPercent,
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
