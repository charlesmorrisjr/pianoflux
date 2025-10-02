import { useEffect, useRef } from 'react';
import abcjs from 'abcjs';

export default function SheetMusicDisplay ({ abcNotation, options = {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !abcNotation) return;

    // Render ABCJS in div
    abcjs.renderAbc(containerRef.current, abcNotation, {
      responsive: 'resize',
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