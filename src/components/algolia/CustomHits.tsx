import { Highlight, useHits, UseHitsProps } from "react-instantsearch";
import "./CustomHits.css";

type CustomHitsProps = {
  onHitClick?: (hit: any) => void;
} & UseHitsProps;

export const CustomHits = (props: CustomHitsProps) => {
  const { items, results } = useHits(props);
  const { onHitClick } = props;
  const queryTextLength = results?.query.length ?? 0;

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
        {items?.map((hit) => (
          <li
            className="ais-Hits-item"
            key={hit.objectID}
            onClick={() => {
              if (onHitClick) {
                onHitClick(hit);
              }
            }}
          >
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
                  <Highlight attribute="duration" hit={hit} />
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
};
