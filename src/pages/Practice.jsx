import { useState } from 'react';
import SheetMusicDisplay from '@/features/practice/components/SheetMusicDisplay';
import { generateRandomABC } from '@/utils/musicGenerator';

import './Practice.css';

export default function Practice() {
  const [exercise, setExercise] = useState(null);
  
  // Generate music
  const handleGenerate = () => {
    const result = generateRandomABC({
      measures: 4,
      key: 'C',
      timeSignature: '4/4',
      noteDurations: ['1/8', '1/4'],
      leftHandPatterns: ['block-chords'],
      rightHandPatterns: ['single-notes']
    });

    setExercise(result);
  }
  
  return (
    <div className="practice">
      <h1>Practice Page</h1>

      <button className="button" onClick={handleGenerate}>
        Generate Exercise
      </button>

      {exercise && (
        <div>
          <SheetMusicDisplay abcNotation={exercise.abcNotation} />
          {/* Later you'll use exercise.noteMetadata for MIDI matching */}
          <p>Notes to play: {exercise.noteMetadata.length}</p>
        </div>
      )}
    </div>
  )
}
