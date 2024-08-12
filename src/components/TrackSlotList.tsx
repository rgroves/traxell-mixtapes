import { ReactNode } from "react";

interface ITapeSideTrackSlotsProps {
  label: string;
  children: ReactNode;
}
function TrackSlotList({ children, label }: ITapeSideTrackSlotsProps) {
  return (
    <div className="track-slots">
      <h3 className="tape-side-label">{label}</h3>
      <ul>{children}</ul>
      <p>{label} Time Remaining: TODO</p>
    </div>
  );
}

export default TrackSlotList;
