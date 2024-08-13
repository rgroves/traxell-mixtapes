import { useCallback, useEffect, useState } from "react";
import "./App.css";
import TrackSlot, { type ITrackSlot } from "./components/TrackSlot";
import TrackSlotList from "./components/TrackSlotList";
import { Search } from "./components/algolia/Search";

interface ISlotPosition {
  side: "A" | "B";
  row: number;
}

const START_SLOT_POS: ISlotPosition = { side: "A", row: 1 } as const;

function createEmptySlots(
  side: string,
  curPos: ISlotPosition,
  slotCount = 6
): ITrackSlot[] {
  const slots = [];
  for (let i = 0; i < slotCount; i++) {
    const position = i + 1;
    const search =
      side === curPos.side && curPos.row === position ? <Search /> : undefined;

    slots.push({
      key: crypto.randomUUID(),
      position,
      artist: "",
      album: "",
      name: "",
      duration: 0,
      search,
    });
  }
  return slots;
}

function App() {
  const createEmptySlotsRef = useCallback(createEmptySlots, []);

  let [aSideSlots, setASideSlots] = useState<ITrackSlot[]>();
  let [bSideSlots, setBSideSlots] = useState<ITrackSlot[]>();
  let [curPosition, setCurPosition] = useState<ISlotPosition>(START_SLOT_POS);

  useEffect(() => {
    // TODO won't need this once full functionality is implemented,
    //      set it up this way so changes in createEmptySlots would
    //      be picked up during intitial development/testing.
    setASideSlots(createEmptySlotsRef("A", curPosition));
    setBSideSlots(createEmptySlotsRef("B", curPosition));
  }, [createEmptySlotsRef, curPosition]);

  return (
    <>
      <main>
        <h1>Traxell Mixtapes</h1>
        <h2>
          Every special
          <span className="rotatingText-adjective"> moment </span>
          <span className="rotatingText-adjective"> feeling </span>
          <span className="rotatingText-adjective"> event </span>
          deserves a mixtape.
        </h2>
        <div className="track-slot-list-container">
          <TrackSlotList label="A-Side">
            {aSideSlots?.map((track, idx) => (
              <TrackSlot key={track.key} position={idx + 1} track={track} />
            ))}
          </TrackSlotList>
          <TrackSlotList label="B-Side">
            {bSideSlots?.map((track, idx) => (
              <TrackSlot key={track.key} position={idx + 1} track={track} />
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
