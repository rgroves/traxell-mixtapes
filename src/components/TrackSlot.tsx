interface ITrackSlot {
  id: number;
  artist: string;
  album: string;
  name: string;
  duration: number;
}

interface ITrackSlotProps {
  track: ITrackSlot;
}

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60).toString();
  const seconds = (duration % 60).toString();
  return duration !== 0 ? `${minutes}:${seconds}` : "";
}

function TrackSlot({ track }: ITrackSlotProps) {
  const displayDuration = formatDuration(track.duration);

  return (
    <li className="track-slot">
      {track.name ? (
        <>
          <div className="track-number">{track.id}.</div>
          <div className="track-name">{track.name}</div>
          <div className="track-artist">{track.artist}</div>
          <div className="track-album">{track.album}</div>
          <div className="track-duration">[{displayDuration}]</div>
        </>
      ) : (
        <div className="track-number">{track.id}.</div>
      )}
    </li>
  );
}

export default TrackSlot;
