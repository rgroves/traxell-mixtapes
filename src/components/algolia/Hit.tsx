import { Highlight } from "react-instantsearch";
import { Hit as AlgoliaHit } from "instantsearch.js";

interface ITrackEntity {
  image: string;
  artist: string;
  song: string;
  album: string;
}

interface IHit {
  hit: AlgoliaHit<ITrackEntity>;
}

export const Hit = ({ hit }: IHit) => {
  return (
    <article>
      {hit.image ? <img src={hit.image} /> : <p>No Image Avaliable</p>}
      <div className="hit-artist">
        <Highlight attribute="artist" hit={hit} />
      </div>
      <div className="hit-song">
        <Highlight attribute="song" hit={hit} />
      </div>
      <div className="hit-album">
        <Highlight attribute="album" hit={hit} />
      </div>
    </article>
  );
};
