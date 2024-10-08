export interface IMixtape {
  title: string;
  aSideTimeRemaining: number;
  bSideTimeRemaining: number;
}

export interface IMixtapeTrack {
  id: string;
  trackNbr?: number;
  artist: string;
  album: string;
  song: string;
  duration: number;
}

export type MixtapeSideLabel = "A" | "B";

interface INextAvailableTrack {
  side: MixtapeSideLabel;
  trackNbr: number;
}

export interface ITrackAddedStatus {
  wasAdded: boolean;
  reason: string;
}

const MINUTES_30_IN_SECONDS = 60 * 30;
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

  get id() {
    return this._id;
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
      reason = "";
    } else {
      reason = `${this._label}-Side does not have enough room left for chosen song.`;
    }

    return { wasAdded, reason };
  }
}

class Mixtape {
  title: string;
  _lastRecordedOnSide: MixtapeSideLabel;
  _aSide: MixtapeSide;
  _bSide: MixtapeSide;
  _totalLength: number;
  _trackSet: Set<string>;
  _lastTrackIdAdded: string;
  _id: string;

  constructor(title: string) {
    this._id = crypto.randomUUID();
    this.title = title;
    this._aSide = new MixtapeSide("A", DEFAULT_TAPE_SIDE_LENGTH_IN_SECONDS);
    this._bSide = new MixtapeSide("B", DEFAULT_TAPE_SIDE_LENGTH_IN_SECONDS);
    this._totalLength =
      this._aSide.secondsRemaining + this._bSide.secondsRemaining;
    this._lastRecordedOnSide = "A";
    this._trackSet = new Set();
    this._lastTrackIdAdded = "";
  }

  private getSide(side: MixtapeSideLabel) {
    let trackSide;

    if (side === "A") {
      trackSide = this._aSide;
    } else {
      trackSide = this._bSide;
    }

    return trackSide;
  }

  get id() {
    return this._id;
  }

  get lastRecordedSide() {
    return this._lastRecordedOnSide;
  }

  get lastTrackIdAdded() {
    return this._lastTrackIdAdded;
  }

  get totalLength() {
    return this._totalLength;
  }

  addNextTrack(
    side: MixtapeSideLabel,
    track: IMixtapeTrack
  ): ITrackAddedStatus {
    let addStatus: ITrackAddedStatus = {
      wasAdded: false,
      reason: "",
    };

    if (!this._trackSet.has(track.id)) {
      let { trackNbr } = this.getNextEmptyTrack(side);
      let recordOnSide = side;

      if (
        recordOnSide === "A" &&
        !this.hasRoomForTrack(recordOnSide, track.duration)
      ) {
        recordOnSide = "B";
        trackNbr = this.getNextEmptyTrack(recordOnSide).trackNbr;
      }

      if (
        recordOnSide === "B" &&
        !this.hasRoomForTrack(recordOnSide, track.duration)
      ) {
        addStatus.reason = "No room for track";
        // No room on either side so set this back to the original side to keep
        // context of where it was attempted.
        recordOnSide = side;
      } else {
        addStatus = this.getSide(recordOnSide).addTrack(
          track.id,
          trackNbr,
          track.artist,
          track.album,
          track.song,
          track.duration
        );
      }

      this._lastRecordedOnSide = recordOnSide;

      if (addStatus.wasAdded) {
        this._trackSet.add(track.id);
        this._lastTrackIdAdded = track.id;
      }
    } else {
      addStatus.reason = "Song is already on tape.";
    }

    return addStatus;
  }

  getNextEmptyTrack(side: MixtapeSideLabel): INextAvailableTrack {
    let trackNbr = 0;

    if (side === "A" && this._aSide.secondsRemaining > 0) {
      trackNbr = this._aSide.tracks.length + 1;
    } else if (side === "B" && this._bSide.secondsRemaining > 0) {
      trackNbr = this._bSide.tracks.length + 1;
    } else {
      console.error(`Invalid side value: ${side}`);
    }

    return { side, trackNbr };
  }

  getLastRecordedTrackId(side: MixtapeSideLabel): string {
    const tracks = side === "A" ? this._aSide.tracks : this._bSide.tracks;
    return tracks.length > 0 ? tracks[tracks.length - 1].id : "";
  }

  getASideTracks(): IMixtapeTrack[] {
    return this.getSide("A").tracks.map((track) => track.toJSON());
  }

  getBSideTracks(): IMixtapeTrack[] {
    return this.getSide("B").tracks.map((track) => track.toJSON());
  }

  getTapeRemainingSeconds(side: MixtapeSideLabel) {
    return this.getSide(side).secondsRemaining;
  }

  getAllTrackIds() {
    return this._trackSet.keys();
  }

  hasRoomForTrack(side: MixtapeSideLabel, duration: number) {
    return this.getSide(side).secondsRemaining >= duration;
  }

  isTrackPresent(trackId: string) {
    return this._trackSet.has(trackId);
  }
}

export default Mixtape;
