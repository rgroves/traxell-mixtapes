export interface IMixtape {
  title: string;
  aSideTimeRemaining: number;
  bSideTimeRemaining: number;
}

export interface IMixtapeTrack {
  id: string;
  trackNbr: number;
  artist: string;
  album: string;
  song: string;
  duration: number;
}

export type MixtapeSideLabel = "A" | "B";

interface INextAvailableTrack {
  side: MixtapeSideLabel;
  trackNbr: number;
  secondsRemaining: number;
}

export interface ITrackAddedStatus {
  wasAdded: boolean;
  reason: string;
}

const DEFAULT_TITLE = `Awesome Mix Vol. 1`;
const MINUTES_30_IN_SECONDS = 60 * 30;
// TODO need to better handle tape duation (ensure both sides same length)
const DEFAULT_TAPE_SIDE_LENGTH_IN_SECONDS = MINUTES_30_IN_SECONDS;
const UNKNOWN = "Unknown";

class MixtapeTrack {
  private _id = "";
  private _trackNbr = 0;
  private _artist = "";
  private _album = "";
  private _song = "";
  private _duration = 0;

  constructor(
    id: string,
    trackNbr: number,
    artist: string,
    album: string,
    song: string,
    duration: number
  ) {
    if (id.trim().length === 0) {
      throw new Error("Invalid track id");
    }
    if (trackNbr <= 0) {
      throw new Error("Invalid track number");
    }

    if (duration <= 0) {
      throw new Error("Invalid duration value");
    }

    this._id = id;
    this._trackNbr = trackNbr;
    this._artist = artist ? artist : UNKNOWN;
    this._album = album ? album : UNKNOWN;
    this._song = song ? song : UNKNOWN;
    this._duration = duration;
  }

  get song() {
    return this._song;
  }

  get trackNbr() {
    return this._trackNbr;
  }

  toJSON() {
    return {
      id: this._id,
      trackNbr: this._trackNbr,
      artist: this._artist,
      album: this._album,
      song: this._song,
      duration: this._duration,
    };
  }
}

class MixtapeSide {
  private _label: MixtapeSideLabel = "A";
  private _secondsRemaining: number = DEFAULT_TAPE_SIDE_LENGTH_IN_SECONDS;
  private _tracks: MixtapeTrack[];

  constructor(label: MixtapeSideLabel, length: number) {
    this._label = label;
    this._secondsRemaining =
      length >= MINUTES_30_IN_SECONDS && length % MINUTES_30_IN_SECONDS === 0
        ? length
        : DEFAULT_TAPE_SIDE_LENGTH_IN_SECONDS;
    this._tracks = [];
  }

  get secondsRemaining() {
    return this._secondsRemaining;
  }

  get tracks() {
    return this._tracks;
  }

  addTrack(
    id: string,
    trackNbr: number,
    artist: string,
    album: string,
    song: string,
    duration: number
  ) {
    let wasAdded = false;
    let reason = "Unknown";

    if (this._secondsRemaining >= duration) {
      this._tracks.push(
        new MixtapeTrack(id, trackNbr, artist, album, song, duration)
      );
      this._secondsRemaining -= duration;
      wasAdded = true;
      reason = "success";
    } else {
      reason = `${this._label}-Side does not have enough room left for chosen song.`;
    }

    return { wasAdded, reason };
  }
}

class Mixtape {
  readonly title: string;
  _lastRecordedOnSide: MixtapeSideLabel;
  _sideA: MixtapeSide;
  _sideB: MixtapeSide;
  _totalLength: number;
  _trackSet: Set<string>;

  constructor(title?: string) {
    this.title = title ?? DEFAULT_TITLE;
    this._sideA = new MixtapeSide("A", DEFAULT_TAPE_SIDE_LENGTH_IN_SECONDS);
    this._sideB = new MixtapeSide("B", DEFAULT_TAPE_SIDE_LENGTH_IN_SECONDS);
    this._totalLength =
      this._sideA.secondsRemaining + this._sideB.secondsRemaining;
    this._lastRecordedOnSide = "A";
    this._trackSet = new Set();
  }

  private getSide(side: MixtapeSideLabel) {
    let trackSide;

    if (side === "A") {
      trackSide = this._sideA;
    } else {
      trackSide = this._sideB;
    }

    return trackSide;
  }

  get lastRecordedSide() {
    return this._lastRecordedOnSide;
  }

  get totalLength() {
    return this._totalLength;
  }

  addNextTrack(
    side: MixtapeSideLabel,
    id: string,
    artist: string,
    album: string,
    song: string,
    duration: number
  ): ITrackAddedStatus {
    let addStatus: ITrackAddedStatus = {
      wasAdded: false,
      reason: "",
    };

    if (!this._trackSet.has(id)) {
      const { trackNbr } = this.getNextEmptyTrack(side);
      let recordOnSide = side;

      if (
        recordOnSide === "A" &&
        !this.hasRoomForTrack(recordOnSide, duration)
      ) {
        recordOnSide = "B";
      }

      if (
        recordOnSide === "B" &&
        !this.hasRoomForTrack(recordOnSide, duration)
      ) {
        addStatus.reason = "No room for track";
        // No room on either side so set this back to the original side to keep
        // context of where it was attempted.
        recordOnSide = side;
      } else {
        addStatus = this.getSide(recordOnSide).addTrack(
          id,
          trackNbr,
          artist,
          album,
          song,
          duration
        );
      }

      this._lastRecordedOnSide = recordOnSide;

      if (addStatus.wasAdded) {
        this._trackSet.add(id);
      }
    } else {
      addStatus.reason = "Song is already on tape.";
    }

    return addStatus;
  }

  getNextEmptyTrack(side: MixtapeSideLabel): INextAvailableTrack {
    let trackNbr = 0;

    let secondsRemaining = 0; // TODO this is currently unused outside of this method and can be removed

    if (side === "A" && this._sideA.secondsRemaining > 0) {
      trackNbr = this._sideA.tracks.length + 1;
      secondsRemaining = this._sideA.secondsRemaining;
    } else if (side === "B" && this._sideB.secondsRemaining > 0) {
      trackNbr = this._sideB.tracks.length + 1;
      secondsRemaining = this._sideA.secondsRemaining;
    } else {
      console.error(`Invalid side value: ${side}`);
    }

    return { side, trackNbr, secondsRemaining };
  }

  getSideATracks(): IMixtapeTrack[] {
    return this.getSide("A").tracks.map((track) => track.toJSON());
  }

  getSideBTracks(): IMixtapeTrack[] {
    return this.getSide("B").tracks.map((track) => track.toJSON());
  }

  getTimeRemaining() {
    return {
      sideA: this.getSide("A").secondsRemaining,
      sideB: this.getSide("B").secondsRemaining,
    };
  }

  hasRoomForTrack(side: MixtapeSideLabel, duration: number) {
    return this.getSide(side).secondsRemaining >= duration;
  }

  isTrackPresent(trackId: string) {
    return this._trackSet.has(trackId);
  }
}

export default Mixtape;
