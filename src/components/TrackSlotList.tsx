import { ReactNode } from "react";
import { formatSecondsToTimeDisplay } from "../utils";
import { type IMixtapeUIState } from "../App";
import { type MixtapeSideLabel } from "../data/Mixtape";
import "./TrackSlotList.css";

interface ITapeSideTrackSlotsProps {
  label: MixtapeSideLabel;
  mixtapeUIState: IMixtapeUIState;
  children: ReactNode[];
}
function TrackSlotList({
  label,
  mixtapeUIState,
  children,
}: ITapeSideTrackSlotsProps) {
  const tapeTimeRemaining = mixtapeUIState.timeRemaining;
  const timeRemaining =
    label === "A" ? tapeTimeRemaining.aSide : tapeTimeRemaining.bSide;
  const displayLabel = `${label}-Side`;
  const displayTimeRemaining = formatSecondsToTimeDisplay(timeRemaining);

  return (
    <div className="track-slots-container">
      <h3 className="tape-side-label">{displayLabel}</h3>
      <p>
        {displayLabel} Time Remaining: {displayTimeRemaining}
      </p>
      <hr />
      <ul className="track-slots">{children}</ul>
    </div>
  );
}

export default TrackSlotList;
