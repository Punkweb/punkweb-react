import React from 'react';
import { useAuth } from '~/auth';
import { http } from '~/http';
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

  const playTimerRef = React.useRef<NodeJS.Timeout>();

  const { user } = useAuth();

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

    playTimerRef.current = setTimeout(
      () => {
        trackAnalyticsEvent(playQueue[0], '30_second_song_play');
      },
      playQueue[0].duration < 31 ? playQueue[0].duration * 1000 : 30000,
    );

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

    return () => {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
      }
    };
  }, [playQueue]);

  function createAudio() {
    const audio = new Audio();

    audio.addEventListener('canplaythrough', () => {
      audio.play();
    });
    audio.addEventListener('pause', () => {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
      }
    });
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    });
    audio.addEventListener('ended', () => {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
      }
      setPlayQueue((prevPlayQueue) => {
        setHistory([...history, prevPlayQueue[0]]);
        trackAnalyticsEvent(prevPlayQueue[0], 'finished_song');
        return prevPlayQueue.slice(1);
      });
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

  function trackAnalyticsEvent(audio: PunkwebAudio, action: string) {
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
