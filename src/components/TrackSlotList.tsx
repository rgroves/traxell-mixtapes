import { ReactNode } from "react";
import "./TrackSlotList.css";
import { formatSecondsToTimeDisplay } from "../utils";

interface ITapeSideTrackSlotsProps {
  label: string;
  timeRemaining: number;
  children: ReactNode;
}
function TrackSlotList({
  label,
  timeRemaining,
  children,
}: ITapeSideTrackSlotsProps) {
  return (
    <div className="track-slots-container">
      <h3 className="tape-side-label">{label}</h3>
      <p>
        {label} Time Remaining: {formatSecondsToTimeDisplay(timeRemaining)}
      </p>
      <hr />
      <ul className="track-slots">{children}</ul>
    </div>
  );
}

export default TrackSlotList;
