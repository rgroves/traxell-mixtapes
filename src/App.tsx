import { useState } from "react";
import CustomSink from "./components/algolia/CustomSink";
import { Search } from "./components/algolia/Search";
import MixtapeContext from "./components/MixtapeProvider";
import PurchaseDialog from "./components/PurchaseDialog";
import TrackSlot, {
  type ISearchSlot,
  type DisplayTrackSlot,
} from "./components/TrackSlot";
import TrackSlotList from "./components/TrackSlotList";
import { algRegCheck, algRegKey, algRegister } from "./data/algolia";
import Mixtape, {
  type IMixtapeTrack,
  type ITrackAddedStatus,
  type MixtapeSideLabel,
} from "./data/Mixtape";
import "./App.css";
import TrackSlotListSwitcher from "./components/TrackSlotListSwitcher";
import PurchaseButton from "./components/PurchaseButton";

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

export interface IMixtapeUIState {
  mixtape: Mixtape;
  aSideTracks: IMixtapeTrack[];
  bSideTracks: IMixtapeTrack[];
  activeSide: MixtapeSideLabel;
  timeRemaining: { aSide: number; bSide: number };
}

const blankTape = new Mixtape();

function App() {
  const [mixtapeUIState, setMixtapeUIState] = useState<IMixtapeUIState>({
    mixtape: blankTape,
    aSideTracks: [],
    bSideTracks: [],
    activeSide: "A",
    timeRemaining: blankTape.getTimeRemaining(),
  });
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [algDataKey, setAlgDataKey] = useState("");

  const addTrack = (
    track: Omit<IMixtapeTrack, "trackNbr"> // TODO track down why the need to omit trackNbr
  ): ITrackAddedStatus => {
    let status;
    const tapeLength = mixtapeUIState.mixtape.totalLength;
    if (!algRegCheck(track)) {
      status = mixtapeUIState.mixtape.addNextTrack(
        mixtapeUIState.activeSide,
        track.id,
        track.artist,
        track.album,
        track.song,
        track.duration
      );

      const timeRemaining = mixtapeUIState.mixtape.getTimeRemaining();
      setMixtapeUIState((prev): IMixtapeUIState => {
        return {
          ...prev,
          aSideTracks: prev.mixtape.getASideTracks(),
          bSideTracks: prev.mixtape.getBSideTracks(),
          timeRemaining: timeRemaining,
          activeSide: prev.mixtape.lastRecordedSide,
        };
      });
    } else {
      const keyReason = algRegKey(track);
      const algRegTrack = mixtapeUIState.mixtape.addNextTrack.bind(
        mixtapeUIState.mixtape
      );
      const register = algRegister(keyReason, tapeLength, algRegTrack);
      if (register.wasAdded) {
        setMixtapeUIState((prev): IMixtapeUIState => {
          return {
            ...prev,
            aSideTracks: prev.mixtape.getASideTracks(),
            bSideTracks: prev.mixtape.getBSideTracks(),
            timeRemaining: prev.mixtape.getTimeRemaining(),
            activeSide: prev.mixtape.lastRecordedSide,
          };
        });

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
    return mixtapeUIState.mixtape.isTrackPresent(trackId);
  };

  const aSideEmptySlots = getEmptySlots(mixtapeUIState.activeSide, {
    side: "A",
    trackNbr: mixtapeUIState.aSideTracks.length + 1,
  });
  const bSideEmptySlots = getEmptySlots(mixtapeUIState.activeSide, {
    side: "B",
    trackNbr: mixtapeUIState.bSideTracks.length + 1,
  });

  const handleTrackSlotSwitching = () => {
    setMixtapeUIState((prev): IMixtapeUIState => {
      return {
        ...prev,
        activeSide: prev.activeSide === "A" ? "B" : "A",
      };
    });
  };

  const purchasable =
    mixtapeUIState.aSideTracks.length + mixtapeUIState.bSideTracks.length > 0;

  const purchaseBtnMsg = purchasable
    ? "Purchase Mixtape Tracks"
    : "Add Tracks To Enable Purchase";

  const handlePurchaseClick = () => {
    setShowPurchaseModal(true);
  };

  return (
    <MixtapeContext.Provider
      value={{
        addTrack,
        isTrackPresent,
        getLastTrackIdAdded: () => mixtapeUIState.mixtape.lastTrackIdAdded,
        algSinkTest,
      }}
    >
      <main>
        <h1>Traxell Mixtapes</h1>
        <h2>Every special moment deserves a mixtape</h2>

        <div>
          <TrackSlotListSwitcher
            iconDir="down"
            onClick={handleTrackSlotSwitching}
          />
        </div>
        {algDataKey && (
          <CustomSink algDataKey={algDataKey} setShowDisplay={setAlgDataKey} />
        )}
        <div className="track-slot-list-container">
          <TrackSlotList label="A" mixtapeUIState={mixtapeUIState}>
            {mixtapeUIState.aSideTracks.map((track) => (
              <TrackSlot key={track.id} track={track} />
            ))}
            {aSideEmptySlots.map((track) => (
              <TrackSlot key={track.id} track={track} />
            ))}
          </TrackSlotList>
          <TrackSlotList label="B" mixtapeUIState={mixtapeUIState}>
            {mixtapeUIState.bSideTracks.map((track) => (
              <TrackSlot key={track.id} track={track} />
            ))}
            {bSideEmptySlots.map((track) => (
              <TrackSlot key={track.id} track={track} />
            ))}
          </TrackSlotList>
        </div>
        <div>
          <TrackSlotListSwitcher
            iconDir="up"
            onClick={handleTrackSlotSwitching}
          />
        </div>
        <PurchaseButton disabled={!purchasable} onClick={handlePurchaseClick}>
          {purchaseBtnMsg}
        </PurchaseButton>
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
            setShowPurchaseModal={setShowPurchaseModal}
            tracks={[
              ...mixtapeUIState.aSideTracks,
              ...mixtapeUIState.bSideTracks,
            ]}
          />
        )}
      </main>
    </MixtapeContext.Provider>
  );
}

export default App;
