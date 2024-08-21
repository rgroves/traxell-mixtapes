import { createContext } from "react";
import { IMixtapeTrack, ITrackAddedStatus } from "../data/Mixtape";

interface IMixtapeContext {
  addTrack: (track: Omit<IMixtapeTrack, "trackNbr">) => ITrackAddedStatus;
  isTrackPresent: (trackId: string) => boolean;
  getLastTrackIdAdded: () => string;
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
  getLastTrackIdAdded: () => {
    console.error("MixtapeContext.getLastTrackIdAdded not set!");
    return "";
  },
};
const MixtapeContext = createContext<IMixtapeContext>(NullMixtapeContext);

export default MixtapeContext;
