import { ReactNode, useState } from "react";
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
import { liteClient as algoliasearch } from "algoliasearch/lite";
import AlgoliaLogo from "./AlgoliaLogo";
import { FacetDropdown } from "./FacetDropdown";
import { NoResults, NoResultsBoundary } from "./NoResultsBoundary";
import { algAppId, algIndexName, algPublicApiKey } from "../../data/algolia";
import { forceHttps, formatSecondsToTimeDisplay } from "../../utils/general";
import { type MixtapeSideLabel } from "../../data/Mixtape";
import MixtapeBuilderHeader from "../MixtapeBuilderHeader";

export interface ISearchResult {
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
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);
  const Hit = HitWrapper({ onClick: onResultClick });
  const Item = ItemWrapper({ onClick: onResultClick });
  const durationFilter = `duration <= ${secondsRemaining.toString()}`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "70ch",
        backgroundColor: "var(--color-primary)",
        overflow: "none",
        padding: "1rem",
      }}
    >
      <InstantSearch
        future={{
          preserveSharedStateOnUnmount: true,
        }}
        searchClient={algoliaClient}
        indexName={algIndexName}
        insights={false}
      >
        <Configure hitsPerPage={5} filters={durationFilter} />

        <MixtapeBuilderHeader
          activeSide={activeSide}
          onSideSwitch={handleSideSwitch}
          secondsRemaining={secondsRemaining}
        />
        <MixtapeBuilderSecondsRemainingBoundary
          secondsRemaining={secondsRemaining}
        >
          <details
            style={{
              padding: ".5rem",
              marginBlockStart: ".5rem",
            }}
            open={isSearchExpanded}
          >
            <summary
              onClick={(event) => {
                event.preventDefault();
                setIsSearchExpanded((prev) => !prev);
              }}
            >
              Expand/Collapse Search
            </summary>

            {lastTrackIdAdded && (
              <FrequentlyBoughtTogether
                objectIDs={[lastTrackIdAdded]}
                itemComponent={Item}
                headerComponent={() => <h3>Next Track Recommendations</h3>}
                transformItems={(items: Hit<ISearchResult>[]) =>
                  items.filter(
                    (item: Hit<ISearchResult>) =>
                      !filterOutIds.has(item.objectID)
                  )
                }
                queryParameters={{ filters: durationFilter }}
                emptyComponent={() => (
                  <>
                    <h3>Next Track Recommendations</h3>
                    <p>No recommendations available</p>
                  </>
                )}
              />
            )}

            <h3>Select A Track</h3>

            <SearchBox
              placeholder="Search for artist/album/song"
              queryHook={query}
              autoFocus={true}
            />

            <div className="ais-PoweredBy">
              <span className="ais-PoweredBy-text">Search by </span>
              <AlgoliaLogo />
            </div>

            <CurrentRefinements />

            <NoResultsBoundary fallback={<NoResults />}>
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
                    (item: Hit<ISearchResult>) =>
                      !filterOutIds.has(item.objectID)
                  )
                }
              />

              <Pagination />
            </NoResultsBoundary>
          </details>
        </MixtapeBuilderSecondsRemainingBoundary>
      </InstantSearch>
    </div>
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
                textWrap: "wrap",
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
            <p
              style={{
                margin: 0,
                width: "75px",
                height: "75px",
                padding: 0,
                alignContent: "center",
                border: "1px solid var(--color-accent-primary)",
                textWrap: "wrap",
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
