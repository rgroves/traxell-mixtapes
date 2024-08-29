import { MixtapeSideLabel } from "../data/Mixtape";
import AlgoliaLogo from "./algolia/AlgoliaLogo";
import { formatSecondsToTimeDisplay } from "../utils/general";

interface IMixtapeBuilderHeaderProps {
  activeSide: MixtapeSideLabel;
  onSideSwitch: () => void;
  secondsRemaining: number;
}

export default function MixtapeBuilderHeader({
  activeSide,
  onSideSwitch,
  secondsRemaining,
}: IMixtapeBuilderHeaderProps) {
  const timeRemaining = formatSecondsToTimeDisplay(secondsRemaining);

  return (
    <div className="mixtape-builder-header">
      <button
        className="mixtape-builder-header__side-switcher"
        onClick={onSideSwitch}
      >
        Switch to{" "}
        {activeSide === "A" ? (
          <span className="mixtape-builder-header__active-side">B</span>
        ) : (
          <span className="mixtape-builder-header__active-side">A</span>
        )}{" "}
        Side
      </button>
      <div className="mixtape-builder-header__time-remaining">
        Time Remaining: {timeRemaining}
      </div>
      <div className="mixtape-builder-header__powered-by-msg">
        Search powered by <AlgoliaLogo />
      </div>
    </div>
  );
}
