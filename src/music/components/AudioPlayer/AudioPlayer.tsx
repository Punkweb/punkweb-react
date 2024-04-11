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
    let y = e.clientY - target.offsetTop;
    let width = target.clientWidth;
    let clickPercent = x / width;
    let toDuration = audio.duration * clickPercent;
    audio.setTime(toDuration);
  }

  if (audio.playQueue.length === 0) {
    return null;
  }

  return (
    <div className="AudioPlayer">
      <div className="AudioPlayer__container">
        <div className="AudioPlayer__info hideOnMobile">
          <div className="AudioPlayer__image">
            <img src={audio.playQueue[0].album_thumbnail || ''} alt={audio.playQueue[0].title} />
          </div>
          <div>
            <div>
              <Link to={`/albums/${audio.playQueue[0].album_slug}`}>{audio.playQueue[0].title}</Link>
            </div>
            <div>
              By <Link to={`/artists/${audio.playQueue[0].artist_slug}`}>{audio.playQueue[0].artist_name}</Link>
            </div>
          </div>
        </div>
        <div className="AudioPlayer__controls">
          <div className="AudioPlayer__buttons">
            <IconButton onClick={() => audio.back()}>
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </IconButton>
            {audio.instance.current?.paused ? (
              <IconButton onClick={() => audio.play()}>
                <span className="material-symbols-outlined">play_arrow</span>
              </IconButton>
            ) : (
              <IconButton onClick={() => audio.pause()}>
                <span className="material-symbols-outlined">pause</span>
              </IconButton>
            )}
            <IconButton onClick={() => audio.next()}>
              <span className="material-symbols-outlined">arrow_forward_ios</span>
            </IconButton>
          </div>
          <div className="AudioPlayer__flex">
            <div id="currentTime">{timeFormat(audio.currentTime)}</div>
            <div className="AudioPlayer__trackerContainer" onClick={(e) => clickTrackBar(e)}>
              <div id="tracker" onClick={(e) => e.stopPropagation()}></div>
              <div id="tracked" onClick={(e) => e.stopPropagation()} style={{ width: `${audio.trackPercent}%` }}></div>
            </div>
            <div id="totalTime">{timeFormat(audio.duration)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
