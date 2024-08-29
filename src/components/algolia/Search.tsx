import { algAppId, algIndexName, algPublicApiKey } from "../../data/algolia";

import {
  Configure,
  CurrentRefinements,
  FrequentlyBoughtTogether,
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
  useRefinementList,
} from "react-instantsearch";
import type { Hit } from "instantsearch.js";
import { ReactNode } from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import MixtapeBuilderHeader from "../MixtapeBuilderHeader";
import { type MixtapeSideLabel } from "../../data/Mixtape";
import { forceHttps, formatSecondsToTimeDisplay } from "../../utils/general";
import { FacetDropdown } from "./FacetDropdown";

export interface ISearchResult extends Record<string, unknown> {
  image: string;
  objectID: string;
  trackNbr?: number;
  artist: string;
  album: string;
  song: string;
  duration: number;
}

interface ISearchProps {
  activeSide: MixtapeSideLabel;
  handleSideSwitch: () => void;
  onResultClick: (result: ISearchResult) => void;
  filterOutIds: Set<string>;
  lastTrackIdAdded: string;
  secondsRemaining: number;
}

const algoliaClient = algoliasearch(algAppId, algPublicApiKey);
let searchTimeout: ReturnType<typeof window.setTimeout>;

let prevQueryLen = 0;
const query = (query: string, search: (value: string) => void) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (query || prevQueryLen > 0) {
      search(query);
      prevQueryLen = query.length;
    }
  }, 375);
};

const closeOnChange = () => window.innerWidth > 375;

export default function Search({
  activeSide,
  handleSideSwitch,
  onResultClick,
  filterOutIds,
  lastTrackIdAdded,
  secondsRemaining,
}: ISearchProps) {
  const Hit = HitWrapper({ onClick: onResultClick });
  const Item = ItemWrapper({ onClick: onResultClick });

  return (
    <InstantSearch
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      searchClient={algoliaClient}
      indexName={algIndexName}
      insights={false}
    >
      <MixtapeBuilderHeader
        activeSide={activeSide}
        onSideSwitch={handleSideSwitch}
        secondsRemaining={secondsRemaining}
      />
      <Configure hitsPerPage={5} />
      <MixtapeBuilderSecondsRemainingBoundary
        secondsRemaining={secondsRemaining}
      >
        {lastTrackIdAdded && (
          <FrequentlyBoughtTogether
            objectIDs={[lastTrackIdAdded]}
            itemComponent={Item}
            headerComponent={() => <h3>Next Track Recommendations</h3>}
            transformItems={(items: Hit<ISearchResult>[]) =>
              items.filter(
                (item: Hit<ISearchResult>) => !filterOutIds.has(item.objectID)
              )
            }
          />
        )}
        <h3>Select A Track</h3>
        <SearchBox
          placeholder="Search for artist/album/song"
          queryHook={query}
          autoFocus={true}
        />

        <CurrentRefinements />

        <div className="search-panel__filters">
          <ArtistRefinementListBoundary attribute="artist">
            <FacetDropdown closeOnChange={closeOnChange}>
              <RefinementList
                attribute="artist"
                searchable={true}
                searchablePlaceholder="Filter by artist"
              />
            </FacetDropdown>
          </ArtistRefinementListBoundary>

          <AlbumRefinementListBoundary attribute="album">
            <FacetDropdown closeOnChange={closeOnChange}>
              <RefinementList
                searchablePlaceholder="Filter by album"
                attribute="album"
                searchable={true}
              />
            </FacetDropdown>
          </AlbumRefinementListBoundary>
        </div>

        <Hits
          hitComponent={Hit}
          transformItems={(items: Hit<ISearchResult>[]) =>
            items.filter(
              (item: Hit<ISearchResult>) => !filterOutIds.has(item.objectID)
            )
          }
        />
        <Pagination />
      </MixtapeBuilderSecondsRemainingBoundary>
    </InstantSearch>
  );
}

interface IRefinementListBoundaryProps {
  children: ReactNode;
  attribute: string;
}

function ArtistRefinementListBoundary({
  children,
}: IRefinementListBoundaryProps) {
  const { items: artistItems } = useRefinementList({ attribute: "artist" });
  const artistRefinements = artistItems.filter((item) => item.isRefined);
  return artistRefinements.length > 0 ? <></> : children;
}

function AlbumRefinementListBoundary({
  children,
}: IRefinementListBoundaryProps) {
  const { items: albumItems } = useRefinementList({ attribute: "album" });
  const albumRefinements = albumItems.filter((item) => item.isRefined);
  return albumRefinements.length > 0 ? <></> : children;
}

interface IMixtapeBuilderTimeRemainingBoundaryProps {
  children: ReactNode;
  secondsRemaining: number;
}
function MixtapeBuilderSecondsRemainingBoundary({
  children,
  secondsRemaining,
}: IMixtapeBuilderTimeRemainingBoundaryProps) {
  return secondsRemaining ? children : <></>;
}

function HitWrapper({
  onClick,
}: {
  onClick: (hit: Hit<ISearchResult>) => void;
}) {
  function Hit({ hit: result }: { hit: Hit<ISearchResult> }) {
    return (
      <button
        style={{ width: "100%" }}
        onClick={() => {
          onClick(result);
        }}
      >
        <article
          style={{
            display: "flex",
            textWrap: "balance",
            margin: 0,
            padding: 0,
            width: "100%",
          }}
        >
          {result.image ? (
            <img src={forceHttps(result.image)} height={75} width={75} />
          ) : (
            <p
              style={{
                margin: 0,
                width: "75px",
                height: "75px",
                padding: 0,
                alignContent: "center",
                border: "1px solid var(--color-accent-primary)",
              }}
            >
              No Cover Image Available
            </p>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textWrap: "balance",
              margin: 0,
              padding: "0 0 0 1rem",
              justifyContent: "flex-start",
              textAlign: "left",
            }}
          >
            <div>
              <Highlight attribute="song" hit={result} />
            </div>
            <div>
              <Highlight attribute="artist" hit={result} />
            </div>
            <div>
              <Highlight attribute="album" hit={result} />
            </div>
            <div>{formatSecondsToTimeDisplay(result.duration)}</div>
          </div>
        </article>
      </button>
    );
  }
  return Hit;
}

function ItemWrapper({
  onClick,
}: {
  onClick: (hit: Hit<ISearchResult>) => void;
}) {
  function Item({ item }: { item: Hit<ISearchResult> }) {
    return (
      <button
        style={{ width: "100%" }}
        onClick={() => {
          onClick(item);
        }}
      >
        <article
          style={{
            display: "flex",
            textWrap: "balance",
            margin: 0,
            padding: 0,
          }}
        >
          {item.image ? (
            <img src={forceHttps(item.image)} height={75} width={75} />
          ) : (
            "No Cover Image Available"
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textWrap: "balance",
              margin: 0,
              padding: "0 0 0 1rem",
              justifyContent: "flex-start",
              textAlign: "left",
            }}
          >
            <div>{item.song}</div>
            <div>{item.artist}</div>
            <div>{item.album}</div>
            <div>{formatSecondsToTimeDisplay(item.duration)}</div>
          </div>
        </article>
      </button>
    );
  }

  return Item;
}

/**
 * TODO
 * - https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/pagination/react/#no-hits-or-is-the-search-still-in-progress
 */
