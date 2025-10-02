import { useState, useRef } from 'react';
import abcjs from 'abcjs';
import { generateRandomABC } from '@/utils/musicGenerator';

import SheetMusicDisplay from '@/features/practice/components/SheetMusicDisplay';
import Card from '@/shared/components/Card';
import PlayStopButton from '@/features/practice/components/PlayStopButton';

import './Practice.css';

export default function Practice() {
  const [exercise1, setExercise1] = useState(null);
  const [exercise2, setExercise2] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Refs for cursor control
  const sheetMusicRef = useRef(null);
  const timingCallbacksRef = useRef(null);

  // Generate music
  const handleGenerate = () => {
    // Stop cursor if playing
    if (isPlaying) {
      stopCursor()
    }

    const result1 = generateRandomABC({
      measures: 4,
      key: 'C',
      timeSignature: '4/4',
      noteDurations: ['1/8', '1/4'],
      leftHandPatterns: ['block-chords'],
      rightHandPatterns: ['single-notes']
    });

    console.log('✅ Exercise 1 generated:', result1);
    setExercise1(result1);

    const result2 = generateRandomABC({
      measures: 4,
      key: 'C',
      timeSignature: '4/4',
      noteDurations: ['1/8', '1/4'],
      leftHandPatterns: ['block-chords'],
      rightHandPatterns: ['single-notes']
    });

    console.log('✅ Exercise 2 generated:', result2);
    setExercise2(result2);
  }

  const startCursor = () => { 
    const visualObj = sheetMusicRef.current?.getVisualObj()
    if (!visualObj) {
      console.error('❌ No visual object')
      return
    }
    
    const svgContainer = document.querySelector('.sheet-music svg')
    if (!svgContainer) {
      console.error('❌ No SVG container')
      return
    }
    
    // Fix SVG dimensions if null
    const viewBox = svgContainer.getAttribute('viewBox');
    if (viewBox) {
      const [, , width, height] = viewBox.split(' ');
      if (!svgContainer.getAttribute('width')) {
        svgContainer.setAttribute('width', width);
        svgContainer.setAttribute('height', height);
      }
    }
    
    // Remove existing cursor
    const existingCursor = svgContainer.querySelector('.playback-cursor')
    if (existingCursor) {
      existingCursor.remove()
    }
    
    // Create cursor with VERY OBVIOUS settings for debugging
    const cursor = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    cursor.setAttribute('class', 'playback-cursor')
    
    // Use solid color with separate opacity
    cursor.setAttribute('fill', 'blue')        
    cursor.setAttribute('opacity', '0.3')        
    // cursor.setAttribute('stroke-width', '2')     
    cursor.setAttribute('rx', '20')            // Rounded corners
    cursor.setAttribute('ry', '20')
    cursor.style.pointerEvents = 'none'
    
    // Append cursor
    svgContainer.appendChild(cursor)
    
    // Verify it's actually there
    const cursorCheck = svgContainer.querySelector('.playback-cursor');
    
    if (cursorCheck) {      
      // Try to force it to be visible
      cursorCheck.style.display = 'block';
      cursorCheck.style.visibility = 'visible';
    }
    
    // Create timing callbacks
    try {
      const timingCallbacks = new abcjs.TimingCallbacks(visualObj, {
        qpm: 120,
        beatSubdivisions: 2,
        
        eventCallback: (event) => {
          if (!event) {
            stopCursor()
            return
          }
          
          const x = (event.left || 0) - 2;
          const y = (event.top || 0) - 5;
          const width = 16;  // Wider for testing
          const height = (event.height || 40) + 10;
          
          cursor.setAttribute('x', x)
          cursor.setAttribute('y', y)
          cursor.setAttribute('width', width)
          cursor.setAttribute('height', height)
        }
      })
      
      timingCallbacksRef.current = timingCallbacks
      timingCallbacks.start()
      
    } catch (error) {
      console.error('❌ Error starting cursor:', error);
    }
  }
  
  const stopCursor = () => {
    if (timingCallbacksRef.current) {
      timingCallbacksRef.current.stop()
      timingCallbacksRef.current = null
    }
    
    const svgContainer = document.querySelector('.sheet-music svg')
    if (svgContainer) {
      const cursor = svgContainer.querySelector('.playback-cursor')
      if (cursor) cursor.remove()
    }
    
    setIsPlaying(false)
  }
  
  const handlePlayStopToggle = () => {
    if (isPlaying) {
      stopCursor();
    } else {
      setIsPlaying(true);
      startCursor();
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
            <SheetMusicDisplay ref={sheetMusicRef} abcNotation={exercise1.abcNotation} />
            {/* Later you'll use exercise1.noteMetadata for MIDI matching */}
            <p>Notes to play: {exercise1.noteMetadata.length}</p>

            {/* <SheetMusicDisplay abcNotation={exercise2.abcNotation} /> */}
            {/* Later you'll use exercise1.noteMetadata for MIDI matching */}
            <p>Notes to play: {exercise2.noteMetadata.length}</p>
          </Card>
        </>
      )}
    </div>
  )
}
