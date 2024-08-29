import { ReactNode } from "react";
import { IMixtapeTrack } from "../data/Mixtape";
import { formatSecondsToTimeDisplay } from "../utils/general";

interface ISearchSlot extends Partial<IMixtapeTrack> {
  search: ReactNode;
}

interface IMixtapeTrackListProps {
  tracks: (IMixtapeTrack | ISearchSlot)[];
}

export default function MixtapeTrackList({ tracks }: IMixtapeTrackListProps) {
  return (
    <ol className="track-list">
      {tracks.map((track, idx) => (
        <li key={track.id} className="track-list__item">
          <article
            data-id={track.id}
            className={
              (track as ISearchSlot).search
                ? "track track--search-slot"
                : "track"
            }
          >
            <span className="track__number">{idx + 1}.</span>
            <div className="track__search">{(track as ISearchSlot).search}</div>
            <h3 className="track__title">{track.song}</h3>
            <div className="track__artist">{track.artist}</div>
            <div className="track__album">{track.album}</div>
            <div className="track__duration">
              {track.duration ? formatSecondsToTimeDisplay(track.duration) : ""}
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
