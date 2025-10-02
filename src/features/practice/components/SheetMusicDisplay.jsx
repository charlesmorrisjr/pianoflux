import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import abcjs from 'abcjs';

import './SheetMusicDisplay.css';

const SheetMusicDisplay = forwardRef(({ abcNotation }, ref) => {
  const containerRef = useRef(null);
  const visualObjRef = useRef(null);  // Stores ABCJS visual object so we can draw cursor

  useImperativeHandle(ref, () => ({
    getVisualObj: () => visualObjRef.current
  }));

  useEffect(() => {
    if (!containerRef.current || !abcNotation) return;

    // Capture the return value after rendering ABCJS
    const visualObjArray = abcjs.renderAbc(containerRef.current, abcNotation, {
      wrap: {
        minSpacing: 1.8,
        maxSpacing: 2.8,
        preferredMeasuresPerLine: 4
      },
      responsive: 'resize',
      staffwidth: 800,
      add_classes: true,    // Allows highlighting
    })

    // Store the visual object
    if (visualObjArray && visualObjArray.length > 0) {
      visualObjRef.current = visualObjArray[0];
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    }
  }, [abcNotation]);

  return (
    <>
      <div ref={containerRef} className="sheet-music"></div>
    </>
  );
});

export default SheetMusicDisplay;