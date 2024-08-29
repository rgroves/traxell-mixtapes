import { useState } from "react";
import aa from "search-insights";
import Search, { ISearchResult } from "./components/algolia/Search";
import MixtapeInsert from "./components/MixtapeInsert";
import PurchaseDialog from "./components/PurchaseDialog";
import { algAppId, algIndexName, algPublicApiKey } from "./data/algolia";
import Mixtape, {
  type IMixtapeTrack,
  type MixtapeSideLabel,
} from "./data/Mixtape";

export interface IMixtapeState {
  mixtape: Mixtape;
  aSideTracks: IMixtapeTrack[];
  bSideTracks: IMixtapeTrack[];
  activeSide: MixtapeSideLabel;
  allTrackIds: Set<string>;
}

aa("init", { appId: algAppId, apiKey: algPublicApiKey });

function getNewMixtapeState(): IMixtapeState {
  return {
    mixtape: new Mixtape(),
    aSideTracks: [],
    bSideTracks: [],
    activeSide: "A",
    allTrackIds: new Set(),
  };
}

function App() {
  const [mixtapeState, setMixtapeState] = useState<IMixtapeState>(
    getNewMixtapeState()
  );
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  const handleRestart = () => {
    setMixtapeState(getNewMixtapeState());
    setShowPurchaseModal(false);
    setHasPurchased(false);
  };

  const handleTapeSideSwitching = () => {
    setMixtapeState((prev) => ({
      ...prev,
      activeSide: prev.activeSide === "A" ? "B" : "A",
    }));
  };

  const handleResultClick = (result: ISearchResult) => {
    setHasPurchased(false);
    const status = mixtapeState.mixtape.addNextTrack(
      mixtapeState.activeSide,
      result.objectID,
      result.artist,
      result.album,
      result.song,
      result.duration
    );

    if (status.wasAdded) {
      setMixtapeState((prev) => {
        prev.allTrackIds.add(result.objectID);
        return {
          ...prev,
          aSideTracks: prev.mixtape.getASideTracks(),
          bSideTracks: prev.mixtape.getBSideTracks(),
          activeSide: prev.mixtape.lastRecordedSide,
          allTrackIds: prev.allTrackIds,
        };
      });
    }
  };

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

  const handlePurchase = () => {
    setShowPurchaseModal(true);
    if (!hasPurchased) {
      setHasPurchased(true);
      aa("convertedObjectIDs", {
        userToken: mixtapeState.mixtape.id,
        eventName: "Playlist Purchased",
        index: algIndexName,
        objectIDs: Array.from(mixtapeState.mixtape.getAllTrackIds()),
        inferQueryID: true,
      }).catch((reason: unknown) => {
        console.log(reason);
      });
    }
  };

  return (
    <>
      <header>
        <h1>Traxell Mixtapes</h1>
        <h2>Every special moment deserves a mixtape</h2>
      </header>
      <main>
        <MixtapeInsert
          title={mixtapeState.mixtape.title}
          aSideTracks={mixtapeState.aSideTracks}
          bSideTracks={mixtapeState.bSideTracks}
          defaultTrackSlots={6}
          searchControl={searchControl}
          activeTapeSide={mixtapeState.activeSide}
        />

        <div className="button-controls">
          <button
            className="purchase-button"
            disabled={!purchasable}
            onClick={handlePurchase}
          >
            {purchaseBtnMsg}
          </button>

          <button className="mixtape-reset-button" onClick={handleRestart}>
            Start A New Mixtape
          </button>
        </div>

        <p>
          <strong>Note:</strong>{" "}
          <em>
            This is a demo. Songs in the system are currently limited to a small
            number of popular selections from 80&apos;s, 90&apos;s, and
            00&apos;s Rap/Hip Hop/R&B
          </em>
        </p>

        <PurchaseDialog
          show={showPurchaseModal}
          setShowPurchaseModal={setShowPurchaseModal}
          tracks={[...mixtapeState.aSideTracks, ...mixtapeState.bSideTracks]}
        />
      </main>
      <footer>
        <p>Made with ❤️, 🧠, and ☕ in Chicago, IL, USA.</p>
      </footer>
    </>
  );
}

export default App;
