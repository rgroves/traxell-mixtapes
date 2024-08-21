import { useContext, useState } from "react";
import algoliasearch, { type SearchClient } from "algoliasearch/lite";
import "instantsearch.css/themes/algolia.css";
import { InstantSearch, SearchBox, Configure } from "react-instantsearch";
import { CustomHits } from "./CustomHits";
import "./Search.css";
import MixtapeContext from "../MixtapeProvider";
import { type InstantSearchProps } from "react-instantsearch";
import { algAppId, algPublicApiKey, algIndexName } from "../../data/algolia";
import CustomRecommendNextTrack from "./CustomRecommendNextTrack";
import { IMixtapeTrack } from "../../data/Mixtape";
import { createSearchProxy } from "../../utils/searchProxy";

const algoliaClient: SearchClient = algoliasearch(algAppId, algPublicApiKey);
const searchClient = createSearchProxy<IMixtapeTrack>(algoliaClient);

export const Search = () => {
  const {
    addTrack: mixtapeAddTrack,
    isTrackPresent,
    getLastTrackIdAdded,
  } = useContext(MixtapeContext);
  const [addErrorMsg, setAddErrorMsg] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(true);
  const lastSelectedId = getLastTrackIdAdded();
  const addTrack = (hit: IMixtapeTrack) => {
    const addStatus = mixtapeAddTrack(hit);
    if (!addStatus.wasAdded) {
      setAddErrorMsg(addStatus.reason);
    } else {
      setAddErrorMsg("");
    }
    return addStatus;
  };

  const onStateChange: InstantSearchProps["onStateChange"] = ({
    uiState,
    setUiState,
  }) => {
    if (addErrorMsg) {
      setAddErrorMsg("");
    }
    if ((uiState[algIndexName]?.query ?? "").trim()?.length == 0) {
      setShowRecommendations(true);
    } else {
      setShowRecommendations(false);
    }
    setUiState(uiState);
  };

  const algoliaImage = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "/algolia-logo-white.png"
    : "/algolia-logo-blue.png";

  return (
    <>
      <InstantSearch
        searchClient={searchClient}
        indexName={algIndexName}
        future={{ preserveSharedStateOnUnmount: true }}
        onStateChange={onStateChange}
        insights={true}
      >
        <Configure hitsPerPage={5} />
        <div className="ais-InstantSearch">
          <p className="search-powered-by">
            Search powered by <img src={algoliaImage} height={16} width={64} />
          </p>
          <SearchBox
            autoFocus={true}
            placeholder="Search for song title, artist, or album"
          />
          {lastSelectedId && (
            <CustomRecommendNextTrack
              opened={showRecommendations}
              objectIDs={[getLastTrackIdAdded()]}
              addErrorMsg={addErrorMsg}
              addTrack={addTrack}
              isTrackPresent={isTrackPresent}
            />
          )}
          <CustomHits
            addErrorMsg={addErrorMsg}
            addTrack={addTrack}
            isTrackPresent={isTrackPresent}
          />
          {/* Add pagination (https://www.algolia.com/doc/guides/building-search-ui/getting-started/react/#paginate-your-results)
              ...or maybe infinite hits. (https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/)
              Add refinements? (https://www.algolia.com/doc/guides/building-search-ui/getting-started/react/#filter-with-a-refinement-list)
          */}
        </div>
      </InstantSearch>
    </>
  );
};
