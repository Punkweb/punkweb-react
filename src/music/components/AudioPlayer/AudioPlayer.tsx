import { Link } from 'react-router-dom';
import { IconButton } from '~/ui';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import './AudioPlayer.scss';

export const AudioPlayer = () => {
  const audio = useAudioPlayer();

  function timeFormat(time: number) {
    let hrs = Math.floor(time / 3600);
    let mins = Math.floor(time / 60);
    let secs = Math.floor(time - mins * 60);
    let str = '';
    if (hrs > 0) {
      str += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }
    str += '' + mins + ':' + (secs < 10 ? '0' : '');
    str += '' + secs;
    return str;
  }

  function clickTrackBar(e: any) {
    let target = e.target;
    let x = e.clientX - target.offsetLeft;
    let width = target.clientWidth;
    let clickPercent = x / width;
    let toDuration = audio.duration * clickPercent;
    audio.currentTime = toDuration;
  }

  if (audio.playQueue.length === 0) {
    return null;
  }

  return (
    <div className="AudioPlayer">
      <div className="AudioPlayer__container">
        <div className="AudioPlayer__info hideOnMobile">
          <div className="AudioPlayer__image">
            <img src={audio.playQueue[0].album.thumbnail || ''} alt={audio.playQueue[0].title} />
          </div>
          <div className="AudioPlayer__links">
            <Link className="AudioPlayer__title" to={`/albums/${audio.playQueue[0].album.slug}`}>
              {audio.playQueue[0].title}
            </Link>
            <Link className="AudioPlayer__artist" to={`/artists/${audio.playQueue[0].album.artist.slug}`}>
              {audio.playQueue[0].album.artist.name}
            </Link>
          </div>
        </div>
        <div className="AudioPlayer__controls">
          <div className="AudioPlayer__buttons">
            <IconButton onClick={() => audio.back()}>
              <span className="material-symbols-outlined">skip_previous</span>
            </IconButton>
            <IconButton
              onClick={() => {
                if (audio.instance?.paused) {
                  audio.instance?.play();
                } else {
                  audio.instance?.pause();
                }
              }}
              variant="raised"
            >
              <span className="material-symbols-outlined">{audio.instance?.paused ? 'play_arrow' : 'pause'}</span>
            </IconButton>
            <IconButton onClick={() => audio.next()}>
              <span className="material-symbols-outlined">skip_next</span>
            </IconButton>
          </div>
          <div className="AudioPlayer__flex">
            <div className="AudioPlayer__currentTime">{timeFormat(audio.currentTime)}</div>
            <div className="AudioPlayer__trackerContainer" onClick={(e) => clickTrackBar(e)}>
              <div id="tracker"></div>
              <div id="tracked" style={{ width: `${(audio.currentTime / audio.duration) * 100}%` }}></div>
            </div>
            <div className="AudioPlayer__duration">{timeFormat(audio.duration)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
