import React from 'react';
import { useAuth } from '~/auth';
import { http } from '~/http';
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
  const [playTimeouts, setPlayTimeouts] = React.useState<any[]>([]);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [trackPercent, setTrackPercent] = React.useState(0);

  const instance = React.useRef<HTMLAudioElement>();

  const { user } = useAuth();

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
    }
    setEvents([]);
    try {
      instance.current.src = '';
    } finally {
      instance.current = undefined;
      clearPlayTimeouts();
    }
  }

  function createAudio() {
    if (!instance.current) {
      clearPlayTimeouts();
      instance.current = new Audio();
      // instance.current.crossOrigin = 'anonymous';
      instance.current.preload = 'metadata';
      bind('canplaythrough', () => {
        play();
      });
      bind('ended', () => {
        setHistory([...history, playQueue[0]]);
        setPlayQueue((prevPlayQueue) => prevPlayQueue.slice(1));
        // trackAnalyticsEvent(playQueue[0], 'finished_song');
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
    clearPlayTimeouts();
  }

  function play() {
    if (!instance.current) {
      return;
    }
    instance.current.play();
    addPlayTimeout(playQueue[0]);
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

  function trackAnalyticsEvent(audio: AudioType, action: string) {
    let metadata: any = {
      song_id: audio.id,
      song_length: audio.duration,
      user_id: null,
      user_is_staff: false,
    };
    if (user) {
      metadata.user_id = user.id;
      metadata.user_is_staff = user.is_staff;
    }
    http.post('/api/analytics/analytics_events/', {
      category: 'music_engagement',
      action,
      label: `${audio.album.artist.name}: ${audio.title}`,
      metadata: metadata,
    });
  }

  function addPlayTimeout(audio: AudioType) {
    const timeout = setTimeout(
      () => {
        // trackAnalyticsEvent(audio, '30_second_song_play');
      },
      audio.duration < 31 ? audio.duration * 1000 : 30000,
    );
    setPlayTimeouts([...playTimeouts, timeout]);
  }

  function clearPlayTimeouts() {
    playTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    setPlayTimeouts([]);
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
