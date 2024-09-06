import { useCallback, useState } from "react";
import aa from "search-insights";
import Search, { ISearchResult } from "../components/algolia/Search";
import MixtapeInsert from "../components/MixtapeInsert";
import PurchaseDialog from "../components/PurchaseDialog";
import { algIndexName } from "../data/algolia";
import Mixtape, {
  type IMixtapeTrack,
  type MixtapeSideLabel,
} from "../data/Mixtape";

interface IMixtapeState {
  mixtape: Mixtape;
  aSideTracks: IMixtapeTrack[];
  bSideTracks: IMixtapeTrack[];
  activeSide: MixtapeSideLabel;
  allTrackIds: Set<string>;
}

interface IMixtapePanelProps {
  mixtapeTitle: string;
  onRestart: () => void;
}

export default function MixtapePanel({
  mixtapeTitle,
  onRestart,
}: IMixtapePanelProps) {
  const [mixtapeState, setMixtapeState] = useState<IMixtapeState>({
    mixtape: new Mixtape(mixtapeTitle),
    aSideTracks: [],
    bSideTracks: [],
    activeSide: "A",
    allTrackIds: new Set(),
  });
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  const handleTapeSideSwitching = useCallback(() => {
    setMixtapeState((prev) => ({
      ...prev,
      activeSide: prev.activeSide === "A" ? "B" : "A",
    }));
  }, []);

  const handleResultClick = useCallback(
    (result: ISearchResult) => {
      setHasPurchased(false);
      const status = mixtapeState.mixtape.addNextTrack(
        mixtapeState.activeSide,
        {
          ...result,
          id: result.objectID,
        }
      );
      if (status.wasAdded) {
        setMixtapeState((prev) => ({
          ...prev,
          aSideTracks: prev.mixtape.getASideTracks(),
          bSideTracks: prev.mixtape.getBSideTracks(),
          activeSide: prev.mixtape.lastRecordedSide,
          allTrackIds: prev.allTrackIds.add(result.objectID),
        }));
      }
    },
    [mixtapeState.mixtape, mixtapeState.activeSide]
  );

  const searchControl = (
    <Search
      activeSide={mixtapeState.activeSide}
      handleSideSwitch={handleTapeSideSwitching}
      onResultClick={handleResultClick}
      filterOutIds={mixtapeState.allTrackIds}
      lastTrackIdAdded={mixtapeState.mixtape.getLastRecordedTrackId(
        mixtapeState.activeSide
      )}
      secondsRemaining={mixtapeState.mixtape.getTapeRemainingSeconds(
        mixtapeState.activeSide
      )}
    />
  );

  const purchasable = mixtapeState.allTrackIds.size > 0;
  const purchaseBtnMsg = purchasable
    ? "Purchase Mixtape Tracks"
    : "Add Tracks To Enable Purchase";

  const handlePurchase = useCallback(() => {
    setShowPurchaseModal(true);
    if (!hasPurchased) {
      setHasPurchased(true);
      aa("convertedObjectIDs", {
        userToken: mixtapeState.mixtape.id,
        eventName: "Playlist Purchased",
        index: algIndexName,
        objectIDs: Array.from(mixtapeState.mixtape.getAllTrackIds()),
      }).catch((reason: unknown) => {
        console.error(reason);
      });
    }
  }, [mixtapeState.mixtape, hasPurchased]);

  return (
    <>
      <MixtapeInsert
        title={mixtapeState.mixtape.title}
        aSideTracks={mixtapeState.aSideTracks}
        bSideTracks={mixtapeState.bSideTracks}
        defaultTrackSlots={6}
        searchControl={searchControl}
        activeTapeSide={mixtapeState.activeSide}
      />

      <div className="button-controls">
        <button className="mixtape-reset-button" onClick={onRestart}>
          Start A New Mixtape
        </button>
        <button
          className="purchase-button"
          disabled={!purchasable}
          onClick={handlePurchase}
        >
          {purchaseBtnMsg}
        </button>
      </div>

      <p>
        <strong>Note:</strong>{" "}
        <em>
          This is a demo. Songs in the system are currently limited to a small
          number of popular selections from 80&apos;s, 90&apos;s, and 00&apos;s
          Rap/Hip Hop/R&B
        </em>
      </p>

      <PurchaseDialog
        show={showPurchaseModal}
        setShowPurchaseModal={setShowPurchaseModal}
        tracks={[...mixtapeState.aSideTracks, ...mixtapeState.bSideTracks]}
      />
    </>
  );
}
