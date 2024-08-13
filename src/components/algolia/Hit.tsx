import { Highlight } from "react-instantsearch";
import { Hit as AlgoliaHit } from "instantsearch.js";
import "./Hit.css";

interface ITrackEntity {
  image: string;
  artist: string;
  song: string;
  album: string;
  duration: number;
}

interface IHit {
  hit: AlgoliaHit<ITrackEntity>;
}

export const Hit = ({ hit }: IHit) => {
  // TODO Need to ensure any long values are truncated with ellipsis
  return (
    <article>
      {hit.image ? (
        <img className="hit-image" src={hit.image} height="100" width="100" />
      ) : (
        <p>No Image Avaliable</p>
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
  );
};
