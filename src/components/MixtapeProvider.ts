import { createContext } from "react";
import { IMixtapeTrack, ITrackAddedStatus } from "../data/Mixtape";
import { AlgSinkMethod } from "../data/algolia";

interface IMixtapeContext {
  addTrack: (track: Omit<IMixtapeTrack, "trackNbr">) => ITrackAddedStatus;
  isTrackPresent: (trackId: string) => boolean;
  algSinkTest: AlgSinkMethod;
}

const NullMixtapeContext: IMixtapeContext = {
  addTrack: () => {
    console.error("MixtapeContext.addTrack not set!");
    return {
      wasAdded: false,
      reason: "MixtapeContext was not initialized. (addTrack not set)",
    };
  },
  isTrackPresent: () => {
    console.error(
      "MixtapeContext was not initialized. (isTrackPresnt not set)"
    );
    return false;
  },
  algSinkTest: () => {
    console.error("MixtapeContext.algSinkTest not set!");
    return {
      wasAdded: false,
      reason: "MixtapeContext was not initialized. (algSinkTest not set)",
    };
  },
};
const MixtapeContext = createContext<IMixtapeContext>(NullMixtapeContext);

export default MixtapeContext;
