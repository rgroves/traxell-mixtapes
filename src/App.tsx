import { useState } from "react";
import "./App.css";
import TrackSlot from "./components/TrackSlot";
import TrackSlotList from "./components/TrackSlotList";

interface ITrackSlot {
  id: number;
  artist: string;
  album: string;
  name: string;
  duration: number;
}

function createEmptySlots(): ITrackSlot[] {
  return [
    { id: 1, artist: "", album: "", name: "", duration: 0 },
    { id: 2, artist: "", album: "", name: "", duration: 0 },
    { id: 3, artist: "", album: "", name: "", duration: 0 },
    { id: 4, artist: "", album: "", name: "", duration: 0 },
    { id: 5, artist: "", album: "", name: "", duration: 0 },
    { id: 6, artist: "", album: "", name: "", duration: 0 },
  ];
}

function App() {
  const [aSideSlots] = useState<ITrackSlot[]>(createEmptySlots());
  const [bSideSlots] = useState<ITrackSlot[]>(createEmptySlots());

  return (
    <>
      <main>
        <h1>Traxell Mixtapes</h1>
        <h2>Every moment deserves a mixtape.</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <TrackSlotList label="A-Side">
            {aSideSlots.map((track) => (
              <TrackSlot key={track.id} track={track} />
            ))}
          </TrackSlotList>
          <TrackSlotList label="B-Side">
            {bSideSlots.map((track) => (
              <TrackSlot key={track.id} track={track} />
            ))}
          </TrackSlotList>
        </div>
        <button disabled={true}>Purchase Mixtape Tracks</button>
        <p>
          <strong>Note:</strong>{" "}
          <em>
            This is a demo. Songs in the system are currently limited to a small
            number of popular selections from 80&apos;s, 90&apos;s, and
            00&apos;s Rap/Hip Hop/R&B
          </em>
        </p>
      </main>
    </>
  );
}

export default App;
