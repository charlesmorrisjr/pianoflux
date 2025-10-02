I'm learning how to code again. I used to know how to code, but I've forgotten a lot. I'm comfortable with JavaScript and overall coding and system design principles, but I'm not a senior developer. I'm not familiar with React either.

When helping on this project, do not directly write the code for me.
Instead:

Act as a senior developer mentor.

Think about the architecture, trade-offs, and best practices.

Walk me through how a feature or solution should be implemented.

Explain the reasoning step by step, so I understand why and how it works.

Guide me in writing the code myself rather than providing the full solution.

The goal: Teach me to think and build like a senior dev, not just copy/paste code.


# Implementation Plan

## Revised Implementation Strategy

**Key Insight**: Auth is deferred, so your MVP is actually simpler. Focus on the practice feature first.

## 1. Routing Structure (Simplified)

```
/ (landing) - public
/practice - public (guest mode)
/login - public (future)
/signup - public (future)

```

**Senior dev thinking**: Since practice works without auth, your landing page can have a big "Start Practicing" button that goes straight to `/practice`. Login is just for saving progress later.

## 2. State Management Strategy

With your answers, here's what state you need:

**Global State (Context or Zustand):**

- User settings: difficulty preference (fixed vs adaptive), difficulty level
- Practice history (stored in localStorage initially, synced to DB when auth added)

**Local State (Practice Page):**

- Current exercise/sheet music
- MIDI input stream
- Performance metrics (accuracy, streak, timing)
- Adaptive difficulty algorithm state

**Senior recommendation**: Use **Zustand** instead of Context for settings/history

- Simpler than Context API
- Easy to persist to localStorage
- Scales well when you add auth later (just swap localStorage for database sync)

## 3. Data Model to Think Through

**Exercise/Sheet Music:**

```jsx
{
  id: string,
  difficulty: number,        // 1-10 or similar
  measures: [],              // generated notes
  timeSignature: "4/4",
  tempo: 80,
  keySignature: "C"
}

```

**Performance Record:**

```jsx
{
  exerciseId: string,
  timestamp: Date,
  accuracy: number,          // % correct notes
  difficulty: number,
  duration: number,          // seconds
  notesPlayed: number,
  correctNotes: number
}

```

**Why this matters now**: Even without auth, design your data structures like they'll be saved to a database. When you add Supabase later, you just change where you write this data.

## 4. Sheet Music Generation Logic

**Architecture Decision**: Separate generation from rendering

```
src/features/practice/
├── components/
│   ├── SheetMusicDisplay.jsx    // Renders with VexFlow
│   ├── MidiInput.jsx             // Handles MIDI connection
│   ├── PracticeControls.jsx     // Start/stop, settings
│   └── PerformanceStats.jsx     // Real-time feedback
├── services/
│   ├── musicGenerator.js        // Core generation logic
│   └── adaptiveDifficulty.js    // Algorithm for adaptive mode
├── hooks/
│   ├── useMidiInput.js
│   ├── useSheetMusic.js
│   └── usePracticeSession.js
└── utils/
    └── noteMatching.js          // Compare MIDI input to expected notes

```

**Generation Strategy**:

**Fixed Difficulty** (simpler, build first):

- Define rules per level (e.g., Level 1: only C-D-E quarter notes)
- Randomly generate within those constraints
- Always musically valid (proper measures, rhythm adds up)

**Adaptive Difficulty** (build second):

- Start at user's chosen starting level
- Track accuracy over last N measures
- If accuracy > 90% for 3+ measures → increase difficulty
- If accuracy < 60% for 2+ measures → decrease difficulty
- Smooth transitions (don't change mid-exercise)

**Senior insight**: The adaptive algorithm needs a "cooldown" period. Don't adjust difficulty too frequently or users feel whiplash.

## 5. MIDI Input Architecture

**Key Challenge**: Matching real-time MIDI input to expected notes

```jsx
// Hook structure
useMidiInput({
  onNoteOn: (note) => {
    // Check if this note matches current expected note
    // Update UI feedback
    // Advance to next note if correct
  },
  onNoteOff: (note) => {
    // Handle note release if tracking duration
  }
})

```

**Senior considerations**:

- **Timing tolerance**: Don't require perfect timing initially. Allow ±200ms window for "correct"
- **Note overlap**: What if user plays two notes at once? (Start simple: only expect single notes)
- **Missed notes**: If user skips a note, do you advance or wait? (Wait, but show visual indicator)

## 6. Practice Page Flow

**User Experience**:

1. Land on `/practice`
2. See difficulty selector (Fixed 1-10 or Adaptive)
3. Click "Start Practice"
4. Sheet music generates and displays
5. MIDI input activates, prompts for device permission
6. User plays, sees real-time feedback (green/red note highlights)
7. After exercise, see stats, option to continue

**State Machine Thinking**:

```
States: SETUP → READY → PRACTICING → REVIEW → (loop to READY)

```

Use a state machine (or simple state enum) to manage this flow. Prevents bugs like "user starts playing before MIDI is connected."

## 7. Implementation Order (Revised)

**Week 1: Core Practice Loop**

1. Set up routing (landing + practice pages)
2. Build sheet music generator (fixed difficulty, single level)
3. Render static sheet music with VexFlow
4. Test generation → display pipeline

**Week 2: MIDI Integration**

1. Build `useMidiInput` hook
2. Implement note matching logic
3. Add visual feedback (highlight notes as played)
4. Test full play loop

**Week 3: Difficulty & Polish**

1. Add difficulty selector UI
2. Implement fixed difficulty levels (1-10)
3. Add performance stats tracking
4. Build adaptive difficulty algorithm

**Week 4: Persistence & Prep for Auth**

1. Store practice history in localStorage
2. Build simple stats dashboard
3. Structure code so auth can be added easily (use service layer pattern)

**Why this order?** Validate the core value prop (practicing with generated music) before adding complexity.

## 8. Technical Gotchas to Plan For

**VexFlow Learning Curve**:

- It's not React-friendly (manipulates DOM directly)
- Wrap in `useEffect` and manage refs carefully
- Consider wrapping in a thin React component that handles lifecycle

**WebMIDI Browser Support**:

- Only Chromium browsers (Chrome, Edge, Opera)
- Need fallback UI: "Please use Chrome for MIDI support"
- Request permissions early and handle rejection gracefully

**Music Theory Validation**:

- Generated music must be rhythmically correct (measures add up)
- Start simple: only 4/4 time, quarter/half notes
- Expand complexity gradually (add eighth notes, different time signatures)

## 9. Setting Up for Future Auth

**Pattern to Use Now**:

```jsx
// services/practiceHistory.js
export const savePracticeRecord = async (record) => {
  // Now: save to localStorage
  localStorage.setItem(...)

  // Later: if user is authenticated, also save to Supabase
  // if (user) await supabase.from('practice_records').insert(record)
}

```

This way, when you add auth:

1. Create Supabase tables matching your data structures
2. Add sync logic to your existing service functions
3. Guest progress can optionally migrate when they sign up

## Questions for You to Consider

Before you start building:

1. **Sight-reading specifics**: Do users see all notes at once, or do they scroll/advance measure by measure?
2. **Feedback granularity**: Real-time per note, or wait until measure complete?
3. **Practice mode variations**: Free play vs. timed challenges vs. specific exercises?

**Senior take**: Start with the simplest version (all notes visible, real-time feedback, free play). You can always add modes later.

## What to Build First?

I'd start with the music generator + display pipeline. Build a simple function that generates one measure of random notes (within constraints), then get VexFlow to render it. This validates the hardest technical piece before building UI around it.

Want me to walk through:

- How to architect the music generation algorithm?
- The note matching logic strategy?
- Setting up Zustand for state management?