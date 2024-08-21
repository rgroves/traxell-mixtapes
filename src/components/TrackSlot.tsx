import { formatSecondsToTimeDisplay } from "../utils/general";
import "./TrackSlot.css";

export interface ITrackSlot {
  id: string;
  trackNbr?: number;
  artist: string;
  album: string;
  song: string;
  duration: number;
}

export interface ISearchSlot extends Pick<ITrackSlot, "id" | "trackNbr"> {
  search: JSX.Element;
}

export type DisplayTrackSlot = ITrackSlot | ISearchSlot;

function isTrackSlot(track: DisplayTrackSlot): track is ITrackSlot {
  return typeof (track as ITrackSlot).duration === "number";
}
function isSearchSlot(track: DisplayTrackSlot): track is ISearchSlot {
  return typeof (track as ISearchSlot).search === "object";
}

interface ITrackSlotProps {
  track: DisplayTrackSlot;
}

function TrackSlot({ track }: ITrackSlotProps) {
  const displayDuration = isTrackSlot(track)
    ? formatSecondsToTimeDisplay(track.duration)
    : "";

  let children: JSX.Element;
  let className = "track-slot";

  if (isSearchSlot(track)) {
    className = "track-slot-search";
    children = (
      <>
        <div className="track-number">{track.trackNbr}.</div>
        <div className="track-search">{track.search}</div>
      </>
    );
  } else if (isTrackSlot(track) && track.song) {
    className = "track-slot-song";
    children = (
      <>
        <div className="track-number">{track.trackNbr}.</div>
        <div className="track-name">{track.song}</div>
        <div className="track-artist">{track.artist}</div>
        <div className="track-album">{track.album}</div>
        <div className="track-duration">{displayDuration}</div>
      </>
    );
  } else {
    className = "track-slot-empty";
    // children = <div className="track-number">{track.trackNbr}.</div>;
    children = <div>&nbsp;</div>;
  }

  return <li className={`track-slot ${className}`}>{children}</li>;
}

export default TrackSlot;
