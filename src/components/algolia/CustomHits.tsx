import {
  Highlight,
  useHits,
  UseHitsProps,
  useSearchBox,
} from "react-instantsearch";
import "./CustomHits.css";
import { ITrackAddedStatus } from "../../data/Mixtape";
import { formatSecondsToTimeDisplay } from "../../utils";

type CustomHitsProps = {
  addErrorMsg: string;
  addTrack: (hit: any) => ITrackAddedStatus; // TODO how can we type this as a track?
  isTrackPresent: (trackId: string) => boolean;
  onHitClick?: (hit: any) => void;
} & UseHitsProps;

export const CustomHits = (props: CustomHitsProps) => {
  const { clear } = useSearchBox();
  const { items = [], results, sendEvent } = useHits(props);
  const { addErrorMsg, addTrack, isTrackPresent, onHitClick } = props;
  const queryTextLength = results?.query.length ?? 0;

  if (queryTextLength === 0 && items.length === 0) {
    return <></>;
  }

  if (queryTextLength > 0 && items.length === 0) {
    return (
      <div className={`ais-Hits`}>
        <ol className="ais-Hits-list">
          <li className="ais-Hits-item ais-Hits-item-empty">
            No matching results
          </li>
        </ol>
      </div>
    );
  }

  return (
    <div className={`ais-Hits`}>
      <ol className="ais-Hits-list">
        {addErrorMsg && (
          <li className="ais-Hits-item ais-Hits-item-empty">{addErrorMsg}</li>
        )}
        {!addErrorMsg &&
          items
            .filter((hit) => !isTrackPresent(hit.objectID))
            .map((hit) => (
              <button
                key={hit.objectID}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (onHitClick) {
                    onHitClick(hit);
                    // TODO add this when going to prod
                    // sendEvent("click", hit, "Hit Clicked");
                  }

                  // TODO need data validation on external Algolia data
                  const addStatus = addTrack({
                    id: hit.objectID,
                    artist: hit.artist,
                    album: hit.album,
                    song: hit.song,
                    duration: hit.duration,
                  });

                  if (addStatus.wasAdded) {
                    clear();
                    // TODO: This is a hack; should use a Custom SearchBox component for better control
                    setTimeout(() => {
                      document
                        .querySelector<HTMLInputElement>(
                          "input.ais-SearchBox-input"
                        )
                        ?.focus();
                    }, 0);
                  }
                }}
              >
                <li className="ais-Hits-item">
                  <article>
                    {hit.image ? (
                      <img
                        className="hit-image"
                        src={hit.image}
                        height="100"
                        width="100"
                      />
                    ) : (
                      <p className="hit-no-image">No Cover Image Avaliable</p>
                    )}
                    <div className="hit-details">
                      <div className="hit-song">
                        <Highlight attribute="song" hit={hit} />
                      </div>
                      <div className="hit-artist">
                        <Highlight attribute="artist" hit={hit} />
                      </div>
                      <div className="hit-album">
                        <Highlight attribute="album" hit={hit} />
                      </div>
                      <div className="hit-duration">
                        {formatSecondsToTimeDisplay(hit.duration)}
                      </div>
                    </div>
                  </article>
                </li>
              </button>
            ))}
      </ol>
    </div>
  );
};
