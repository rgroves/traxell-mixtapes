import algoliasearch, { type SearchClient } from "algoliasearch/lite";
import "instantsearch.css/themes/algolia.css";
import { InstantSearch, SearchBox, Configure } from "react-instantsearch";
import { CustomHits } from "./CustomHits";
import { MultipleQueriesQuery } from "@algolia/client-search";
import "./Search.css";

const algoliaClient = algoliasearch(
  "D4IFTKVOQ8",
  "49d61391bec2712b582de24adaf275b0"
);

const searchClient = {
  ...algoliaClient,
  search(requests: MultipleQueriesQuery[]) {
    if (
      requests.every(
        ({ params }) => params && (!params.query || !params.query.trim())
      )
    ) {
      // If there is no query text input, return an empty (mock) result.
      return Promise.resolve({
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
    }

    // There is query text input, send search request.
    const searchResults = algoliaClient.search(requests);
    return searchResults;
  },
};

export const Search = () => {
  return (
    <>
      <InstantSearch
        searchClient={searchClient as SearchClient}
        indexName="track-data-for-algolia"
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <Configure hitsPerPage={5} />
        <div className="ais-InstantSearch">
          <SearchBox
            autoFocus={true}
            placeholder="Search for song title, artist, or album"
          />
          <CustomHits
            onHitClick={(hit) => {
              console.log(JSON.stringify(hit));
            }}
          />
          {/* Add pagination (https://www.algolia.com/doc/guides/building-search-ui/getting-started/react/#paginate-your-results)
        & refinements (https://www.algolia.com/doc/guides/building-search-ui/getting-started/react/#filter-with-a-refinement-list)
        or maybe infinite hits (https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/)
      */}
        </div>
      </InstantSearch>
    </>
  );
};
