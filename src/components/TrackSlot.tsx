import "./TrackSlot.css";

export interface ITrackSlot {
  key: string;
  position: number;
  artist: string;
  album: string;
  name: string;
  duration: number;
  search?: JSX.Element;
}

interface ITrackSlotProps {
  position: number;
  track: ITrackSlot;
}

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60).toString();
  const seconds = (duration % 60).toString();
  return duration !== 0 ? `[${minutes}:${seconds}]` : "";
}

function TrackSlot({ position, track }: ITrackSlotProps) {
  const displayDuration = formatDuration(track.duration);
  let children: JSX.Element;
  let className = "track-slot";

  if (track.search) {
    className = "track-slot-search";
    children = (
      <>
        <div className="track-number">{position}.</div>
        <div className="track-search">{track.search}</div>
      </>
    );
  } else if (track.name) {
    className = "track-slot-song";
    children = (
      <>
        <div className="track-number">{position}.</div>
        <div className="track-name">{track.name}</div>
        <div className="track-artist">{track.artist}</div>
        <div className="track-album">{track.album}</div>
        <div className="track-duration">{displayDuration}</div>
      </>
    );
  } else {
    className = "track-slot-empty";
    children = <div className="track-number">{position}.</div>;
  }

  return <li className={`track-slot ${className}`}>{children}</li>;
}

export default TrackSlot;
