import { FaPlay, FaStop } from 'react-icons/fa';
import './PlayStopButton.css';

export default function PlayStopButton({ isPlaying, onToggle }) {
  return (
    <button
      className={`play-stop-button ${isPlaying ? 'playing' : 'stopped'}`}
      onClick={onToggle}
      aria-label={isPlaying ? 'Stop' : 'Play'}
    >
      {isPlaying ? <FaStop /> : <FaPlay />}
      <span>{isPlaying ? 'Stop' : 'Play'}</span>
    </button>
  )
}