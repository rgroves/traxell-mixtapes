import algoliasearch from "algoliasearch/lite";
import "instantsearch.css/themes/algolia.css";
import { Hits, InstantSearch, SearchBox, Configure } from "react-instantsearch";

import { Hit } from "./Hit";

const searchClient = algoliasearch(
  "D4IFTKVOQ8",
  "49d61391bec2712b582de24adaf275b0"
);

export const Search = () => {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="track-data-for-algolia"
    >
      <Configure hitsPerPage={5} />
      <div className="ais-InstantSearch">
        <SearchBox
          autoFocus={true}
          placeholder="Search for song title, artist, or album"
        />
        <Hits hitComponent={Hit} />
      </div>
    </InstantSearch>
  );
};
