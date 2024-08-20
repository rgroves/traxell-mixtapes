import { useContext, useState } from "react";
import algoliasearch, { type SearchClient } from "algoliasearch/lite";
import "instantsearch.css/themes/algolia.css";
import { InstantSearch, SearchBox, Configure } from "react-instantsearch";
import { CustomHits } from "./CustomHits";
import { MultipleQueriesQuery } from "@algolia/client-search";
import "./Search.css";
import MixtapeContext from "../MixtapeProvider";
import type { InstantSearchProps } from "react-instantsearch";
import { algQuerySink, algAppId, algPublicApiKey } from "../../data/algolia";
import CustomRecommendNextTrack from "./CustomRecommendNextTrack";
import { IMixtapeTrack } from "../../data/Mixtape";
import { MultipleQueriesResponse } from "@algolia/client-search";

const algoliaClient = algoliasearch(algAppId, algPublicApiKey);

let timerId = 0;
const timeout = 275;

const searchClient = {
  ...algoliaClient,
  async search(
    requests: MultipleQueriesQuery[]
  ): Promise<Readonly<MultipleQueriesResponse<IMixtapeTrack>>> {
    clearTimeout(timerId);
    const asyncDebouncedResult = new Promise<
      Readonly<MultipleQueriesResponse<IMixtapeTrack>>
    >((resolve) => {
      timerId = window.setTimeout(() => {
        if (requests.every(({ params }) => !params?.query?.trim())) {
          // If there is no query text input, return an empty (mock) result.
          resolve({
            results: requests.map(() => ({
              hits: [],
              nbHits: 0,
              nbPages: 0,
              page: 0,
              processingTimeMS: 0,
              hitsPerPage: 0,
              exhaustiveNbHits: false,
              query: "",
              params: "",
            })),
          });
        } else {
          // There is query text input, so send search request.
          const searchResults = algoliaClient.search<IMixtapeTrack>(
            requests,
            {}
          );
          resolve(searchResults);
        }
      }, timeout);
    });

    return await asyncDebouncedResult;
  },
};

export const Search = () => {
  const {
    addTrack: mixtapeAddTrack,
    isTrackPresent,
    getLastTrackIdAdded,
  } = useContext(MixtapeContext);
  const [addErrorMsg, setAddErrorMsg] = useState("");
  const algSinkTest = mixtapeAddTrack;
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
    algQuerySink(uiState, algSinkTest);
    setUiState(uiState);
  };

  return (
    <>
      <InstantSearch
        searchClient={searchClient as SearchClient}
        indexName="track-data-for-algolia"
        future={{ preserveSharedStateOnUnmount: true }}
        onStateChange={onStateChange}
      >
        <Configure hitsPerPage={5} />
        <div className="ais-InstantSearch">
          <span className="powered-by-algolia">
            <SearchBox
              autoFocus={true}
              placeholder="Search for song title, artist, or album"
            />
          </span>
          {lastSelectedId && (
            <CustomRecommendNextTrack
              objectIDs={[getLastTrackIdAdded()]}
              addErrorMsg={addErrorMsg}
              addTrack={addTrack}
              isTrackPresent={isTrackPresent}
              // onHitClick={(hit) => {
              //   console.log(`recommended clicked: ${JSON.stringify(hit)}`);
              // }}
            />
          )}
          <CustomHits
            addErrorMsg={addErrorMsg}
            addTrack={addTrack}
            isTrackPresent={isTrackPresent}
            // onHitClick={(hit) => {
            //   console.log(`result clicked: ${JSON.stringify(hit)}`);
            // }}
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
