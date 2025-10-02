import { useState } from 'react';
import { generateRandomABC } from '@/utils/musicGenerator';

import SheetMusicDisplay from '@/features/practice/components/SheetMusicDisplay';
import Card from '@/shared/components/Card';
import PlayStopButton from '@/features/practice/components/PlayStopButton';

import './Practice.css';

export default function Practice() {
  const [exercise1, setExercise1] = useState(null);
  const [exercise2, setExercise2] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Generate music
  const handleGenerate = () => {
    const result1 = generateRandomABC({
      measures: 4,
      key: 'C',
      timeSignature: '4/4',
      noteDurations: ['1/8', '1/4'],
      leftHandPatterns: ['block-chords'],
      rightHandPatterns: ['single-notes']
    });

    setExercise1(result1);

    const result2 = generateRandomABC({
      measures: 4,
      key: 'C',
      timeSignature: '4/4',
      noteDurations: ['1/8', '1/4'],
      leftHandPatterns: ['block-chords'],
      rightHandPatterns: ['single-notes']
    });

    setExercise2(result2);
  }

  const handlePlayStopToggle = () => {
    setIsPlaying(prev => !prev);

    // Future: Start/stop cursor animation
    if (!isPlaying) {
      console.log('Starting playback...')
      // TODO: Start cursor movement
    } else {
      console.log('Stopping playback...')
      // TODO: Stop cursor movement
    }
  }
  
  return (
    <div className="practice">
      <h1>Practice Page</h1>

      <button className="button" onClick={handleGenerate}>
        Generate Exercise
      </button>

      {exercise1 && (
        <>
          <PlayStopButton
            isPlaying={isPlaying}
            onToggle={handlePlayStopToggle}
          />
          
          <Card>
            <SheetMusicDisplay abcNotation={exercise1.abcNotation} />
            {/* Later you'll use exercise1.noteMetadata for MIDI matching */}
            <p>Notes to play: {exercise1.noteMetadata.length}</p>

            <SheetMusicDisplay abcNotation={exercise2.abcNotation} />
            {/* Later you'll use exercise1.noteMetadata for MIDI matching */}
            <p>Notes to play: {exercise2.noteMetadata.length}</p>
          </Card>
        </>
      )}
    </div>
  )
}
