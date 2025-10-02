import { useEffect, useRef } from 'react';
import abcjs from 'abcjs';

import './SheetMusicDisplay.css';

export default function SheetMusicDisplay ({ abcNotation, options = {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !abcNotation) return;

    // Render ABCJS in div
    abcjs.renderAbc(containerRef.current, abcNotation, {
      wrap: {
        minSpacing: 1.8,
        maxSpacing: 2.8,
        preferredMeasuresPerLine: 4
      },
      responsive: 'resize',
      staffwidth: 800,
      add_classes: true,    // Allows highlighting
      ...options            // Allow custom options to be passed in
    })

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    }
  }, [abcNotation, options]);

  return (
    <>
      <div ref={containerRef} className="sheet-music"></div>
    </>
  );
}