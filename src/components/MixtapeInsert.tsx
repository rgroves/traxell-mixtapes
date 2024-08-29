import { ReactNode } from "react";
import { IMixtapeTrack, MixtapeSideLabel } from "../data/Mixtape";
import MixtapeTrackList from "./MixtapeTrackList";
import MixtapeInsertSide from "./MixtapeInsertSide";

interface IMixtapeInsertProps {
  title: string;
  aSideTracks: IMixtapeTrack[];
  bSideTracks: IMixtapeTrack[];
  defaultTrackSlots?: number;
  searchControl?: ReactNode;
  activeTapeSide?: MixtapeSideLabel | undefined;
}

function createEmptyTracks(
  trackCount: number,
  emptySlotCount: number,
  searchControl: ReactNode
) {
  const emptySlots = [];
  let slotsNeeded = emptySlotCount;

  if (searchControl) {
    emptySlots.push({ id: crypto.randomUUID(), search: searchControl });
    slotsNeeded--;
  }

  if (trackCount < emptySlotCount) {
    const emptyTrack = { id: "", song: "", artist: "", album: "", duration: 0 };
    slotsNeeded -= trackCount;

    while (slotsNeeded-- > 0) {
      emptySlots.push({
        ...Object.assign({}, emptyTrack),
        id: crypto.randomUUID(),
      });
    }
  }
  return emptySlots;
}

export default function MixtapeInsert({
  title,
  aSideTracks,
  bSideTracks,
  defaultTrackSlots = 0,
  searchControl,
  activeTapeSide,
}: IMixtapeInsertProps) {
  const aSideEmptySlots = createEmptyTracks(
    aSideTracks.length,
    defaultTrackSlots,
    activeTapeSide === "A" ? searchControl : null
  );

  const bSideEmptySlots = createEmptyTracks(
    bSideTracks.length,
    defaultTrackSlots,
    activeTapeSide === "B" ? searchControl : null
  );

  return (
    <article className="mixtape-insert">
      <h1 className="mixtape-insert__title">{title}</h1>
      <MixtapeInsertSide label="A">
        <MixtapeTrackList tracks={[...aSideTracks, ...aSideEmptySlots]} />
      </MixtapeInsertSide>
      <MixtapeInsertSide label="B">
        <MixtapeTrackList tracks={[...bSideTracks, ...bSideEmptySlots]} />
      </MixtapeInsertSide>
    </article>
  );
}
