import { ReactNode } from "react";
import "./TrackSlotList.css";

interface ITapeSideTrackSlotsProps {
  label: string;
  children: ReactNode;
}
function TrackSlotList({ children, label }: ITapeSideTrackSlotsProps) {
  return (
    <div className="track-slots-container">
      <h3 className="tape-side-label">{label}</h3>
      <ul className="track-slots">{children}</ul>
      <p>{label} Time Remaining: TODO</p>
    </div>
  );
}

export default TrackSlotList;
