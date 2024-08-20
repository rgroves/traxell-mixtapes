import {
  useFrequentlyBoughtTogether,
  UseFrequentlyBoughtTogetherProps,
  useSearchBox,
} from "react-instantsearch";
import { IMixtapeTrack, ITrackAddedStatus } from "../../data/Mixtape";
import { algBypassFilter } from "../../data/algolia";
import { formatSecondsToTimeDisplay } from "../../utils";
import "./CustomRecommendNextTrack.css";

type CustomRecommendNextTrackProps = {
  objectIDs: string[];
  addErrorMsg: string;
  addTrack: (hit: IMixtapeTrack) => ITrackAddedStatus; // TODO how can we type this as a track?
  isTrackPresent: (trackId: string) => boolean;
  onHitClick?: (hit: IMixtapeTrack) => void;
} & UseFrequentlyBoughtTogetherProps;

export default function CustomRecommendNextTrack(
  props: CustomRecommendNextTrackProps
) {
  const { objectIDs, addErrorMsg, addTrack, isTrackPresent, onHitClick } =
    props;
  const filteredObjectIDs = algBypassFilter(objectIDs);

  if (filteredObjectIDs.length === 0) {
    return <></>;
  }
  const { items } = useFrequentlyBoughtTogether<
    IMixtapeTrack & { image: string }
  >({
    objectIDs: objectIDs,
    limit: 3,
    threshold: 60,
  });
  const { clear } = useSearchBox();

  const filteredItems = addErrorMsg
    ? []
    : items.filter((item) => !isTrackPresent(item.objectID));

  return (
    // This needs to be smart (collapse or )
    <>
      {(filteredItems.length > 0 || addErrorMsg) && (
        <details className="recommend-details" open={true}>
          <summary>Select a recommended next track or search above</summary>
          <div className="ais-FrequentlyBoughtTogether">
            <ol className="ais-FrequentlyBoughtTogether-list">
              {addErrorMsg && (
                <li className="ais-FrequentlyBoughtTogether-item ais-FrequentlyBoughtTogether-item-empty">
                  {addErrorMsg}
                </li>
              )}
              {filteredItems.map((item) => (
                <button
                  key={item.objectID}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (onHitClick) {
                      onHitClick(item);
                      // TODO send event here?
                    }

                    // TODO need data validation on external Algolia data
                    const addStatus = addTrack({
                      id: item.objectID,
                      artist: item.artist,
                      album: item.album,
                      song: item.song,
                      duration: item.duration,
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
                  <li className="ais-FrequentlyBoughtTogether-item">
                    <RecommendedTrack item={item} />
                  </li>
                </button>
              ))}
            </ol>
          </div>
        </details>
      )}
    </>
  );
}

function RecommendedTrack({
  item,
}: {
  item: IMixtapeTrack & { image: string };
}) {
  return (
    <div>
      <article>
        {item.image ? (
          <img src={item.image} height="100" width="100" />
        ) : (
          <p className="hit-no-image">No Cover Image Avaliable</p>
        )}
        <div className="hit-details">
          <div className="hit-song">
            {item.song}
            {/* <Highlight attribute="song" hit={hit} /> */}
          </div>
          <div className="hit-artist">
            {item.artist}
            {/* <Highlight attribute="artist" hit={hit} /> */}
          </div>
          <div className="hit-album">
            {item.album}
            {/* <Highlight attribute="album" hit={hit} /> */}
          </div>
          <div className="hit-duration">
            {formatSecondsToTimeDisplay(item.duration)}
          </div>
        </div>
      </article>
    </div>
  );
}
