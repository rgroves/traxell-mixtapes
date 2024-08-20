import { useState } from "react";
import CustomSink from "./components/algolia/CustomSink";
import { Search } from "./components/algolia/Search";
import MixtapeContext from "./components/MixtapeProvider";
import TrackSlot, {
  type ISearchSlot,
  type DisplayTrackSlot,
} from "./components/TrackSlot";
import PurchaseDialog from "./components/PurchaseDialog";
import TrackSlotList from "./components/TrackSlotList";
import { algRegCheck, algRegKey, algRegister } from "./data/algolia";
import Mixtape, {
  type IMixtapeTrack,
  type ITrackAddedStatus,
  type MixtapeSideLabel,
} from "./data/Mixtape";
import "./App.css";

interface ITrackPosition {
  side: "A" | "B";
  trackNbr: number;
}

const searchDisplaySlot: Omit<ISearchSlot, "trackNbr"> = {
  id: crypto.randomUUID(),
  search: <Search />,
};

function createEmptySlot(trackNbr: number) {
  return {
    id: crypto.randomUUID().toString(),
    trackNbr,
    artist: "",
    album: "",
    song: "",
    duration: 0,
  };
}

const aSideEmptySlots = [
  createEmptySlot(1),
  createEmptySlot(2),
  createEmptySlot(3),
  createEmptySlot(4),
  createEmptySlot(5),
  createEmptySlot(6),
];

const bSideEmptySlots = [
  createEmptySlot(1),
  createEmptySlot(2),
  createEmptySlot(3),
  createEmptySlot(4),
  createEmptySlot(5),
  createEmptySlot(6),
];

function getEmptySlots(
  activeSide: MixtapeSideLabel,
  curPos: ITrackPosition
): DisplayTrackSlot[] {
  const slots = [];
  const emptySlots = activeSide === "A" ? aSideEmptySlots : bSideEmptySlots;

  if (activeSide === curPos.side) {
    slots.push({ ...searchDisplaySlot, trackNbr: curPos.trackNbr });
    slots.push(...emptySlots.slice(curPos.trackNbr));
  } else {
    slots.push(...emptySlots.slice(curPos.trackNbr - 1));
  }
  return slots;
}

function App() {
  const [mixtape] = useState<Mixtape>(new Mixtape());
  const [aSideTracks, setASideTracks] = useState<IMixtapeTrack[]>([]);
  const [bSideTracks, setBSideTracks] = useState<IMixtapeTrack[]>([]);
  const [activeSide, setActiveSide] = useState<MixtapeSideLabel>("A");
  const [timeRemaining, setTimeRemaining] = useState<{
    sideA: number;
    sideB: number;
  }>(mixtape.getTimeRemaining());
  const [enablePurchaseWarning, setEnablePurchaseWarning] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [algDataKey, setAlgDataKey] = useState("");

  const addTrack = (
    track: Omit<IMixtapeTrack, "trackNbr">
  ): ITrackAddedStatus => {
    let status;
    const tapeLength = mixtape.totalLength;
    const algRegTrack = mixtape.addNextTrack.bind(mixtape);
    if (!algRegCheck(track)) {
      status = mixtape.addNextTrack(
        activeSide,
        track.id,
        track.artist,
        track.album,
        track.song,
        track.duration
      );

      setASideTracks(mixtape.getSideATracks());
      setBSideTracks(mixtape.getSideBTracks());
      const timeRemaining = mixtape.getTimeRemaining();
      setTimeRemaining(timeRemaining);
      setActiveSide(mixtape.lastRecordedSide);
      if ((timeRemaining.sideA + timeRemaining.sideB) / tapeLength < 0.1) {
        setEnablePurchaseWarning(false);
      }
    } else {
      const keyReason = algRegKey(track);
      const register = algRegister(keyReason, tapeLength, algRegTrack);
      if (register.wasAdded) {
        setASideTracks(mixtape.getSideATracks());
        setBSideTracks(mixtape.getSideBTracks());
        setTimeRemaining(mixtape.getTimeRemaining());
        setActiveSide(mixtape.lastRecordedSide);
        setAlgDataKey(keyReason);
        status = { wasAdded: true, reason: keyReason };
      } else {
        status = { wasAdded: false, reason: keyReason };
      }
    }

    return status;
  };
  const algSinkTest = addTrack;

  const isTrackPresent = (trackId: string) => {
    return mixtape.isTrackPresent(trackId);
  };

  const aSideEmptySlots = getEmptySlots(activeSide, {
    side: "A",
    trackNbr: aSideTracks.length + 1,
  });
  const bSideEmptySlots = getEmptySlots(activeSide, {
    side: "B",
    trackNbr: bSideTracks.length + 1,
  });

  return (
    <MixtapeContext.Provider
      value={{
        addTrack,
        isTrackPresent,
        getLastTrackIdAdded: () => mixtape.lastTrackIdAdded,
        algSinkTest,
      }}
    >
      <main>
        <h1>Traxell Mixtapes</h1>
        <h2>Every special moment deserves a mixtape</h2>

        <div>
          <button
            onClick={() => {
              setActiveSide(activeSide === "A" ? "B" : "A");
            }}
          >
            ↙️ Switch Active Side ↘️
          </button>
        </div>
        {algDataKey && (
          <CustomSink algDataKey={algDataKey} setShowDisplay={setAlgDataKey} />
        )}
        <div className="track-slot-list-container">
          <TrackSlotList label="A-Side" timeRemaining={timeRemaining.sideA}>
            {aSideTracks.map((track) => (
              <TrackSlot key={track.id} track={track} />
            ))}
            {aSideEmptySlots.map((track) => (
              <TrackSlot key={track.id} track={track} />
            ))}
          </TrackSlotList>
          <TrackSlotList label="B-Side" timeRemaining={timeRemaining.sideB}>
            {bSideTracks.map((track) => (
              <TrackSlot key={track.id} track={track} />
            ))}
            {bSideEmptySlots.map((track) => (
              <TrackSlot key={track.id} track={track} />
            ))}
          </TrackSlotList>
        </div>
        <div>
          <button
            onClick={() => {
              setActiveSide(activeSide === "A" ? "B" : "A");
            }}
          >
            ↖️ Switch Active Side ↗️
          </button>
        </div>
        <button
          className="purchase-button"
          onClick={() => {
            setShowPurchaseModal(true);
          }}
        >
          Purchase Mixtape Tracks
        </button>
        <p>
          <strong>Note:</strong>{" "}
          <em>
            This is a demo. Songs in the system are currently limited to a small
            number of popular selections from 80&apos;s, 90&apos;s, and
            00&apos;s Rap/Hip Hop/R&B
          </em>
        </p>
        {showPurchaseModal && (
          <PurchaseDialog
            show={showPurchaseModal}
            enablePurchaseWarning={enablePurchaseWarning}
            setShowPurchaseModal={setShowPurchaseModal}
            tracks={[...mixtape.getSideATracks(), ...mixtape.getSideBTracks()]}
          />
        )}
      </main>
    </MixtapeContext.Provider>
  );
}

export default App;
