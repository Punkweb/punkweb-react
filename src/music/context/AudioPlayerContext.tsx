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
    console.log('playQueue', playQueue);

    if (playQueue.length === 0) {
      destroyAudio();
      return;
    }

    load(playQueue[0].file);
  }, [playQueue]);

  function load(file: string) {
    console.log('loading', file);
    destroyAudio();
    createAudio();
    if (!instance.current) {
      return;
    }
    instance.current.pause();
    instance.current.src = file;
    instance.current.load();
  }

  function destroyAudio() {
    console.log('destroying audio');
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
      // clearPlayTimeouts();
      instance.current = undefined;
    }
  }

  function createAudio() {
    console.log('creating audio');
    if (!instance.current) {
      instance.current = new Audio();
      // instance.current.crossOrigin = 'anonymous';
      instance.current.preload = 'metadata';
      bind('canplaythrough', () => {
        play();
        // if (!isDevMode()) {
        //   this.clearPlayTimeouts();
        //   this.addPlayTimeout(this._playQueue[0]);
        // }
      });
      bind('ended', () => {
        // if (!isDevMode()) {
        //   let metadata: any = {
        //     song_id: this._playQueue[0].id,
        //     song_length: this._duration,
        //     user_id: null,
        //     user_is_staff: false,
        //   };
        //   if (this.user) {
        //     metadata.user_id = this.user.id;
        //     if (this.user.is_staff || this.user.is_superuser) {
        //       metadata.user_is_staff = true;
        //     }
        //   }
        //   let songFinished = this.api.AnalyticsEvent.create({
        //     category: 'music_engagement',
        //     action: 'finished_song',
        //     label: `${this._playQueue[0].artist_name}: ${this._playQueue[0].title}`,
        //     metadata: metadata,
        //   }).subscribe(
        //     () => {},
        //     () => {},
        //     () => {
        //       songFinished.unsubscribe();
        //     },
        //   );
        // }
        setHistory([...history, playQueue[0]]);
        playQueue.shift();
        setPlayQueue(playQueue);
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

  function pause() {
    if (!instance.current) {
      return;
    }
    console.log('playing');
    instance.current.pause();
  }

  function play() {
    if (!instance.current) {
      return;
    }
    console.log('playing');
    instance.current.play();
    // if (!isDevMode()) {
    //   this.addPlayTimeout(this._playQueue[0]);
    // }
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
