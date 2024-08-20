import CertData from "./CertData";

export const algAppId = "D4IFTKVOQ8";
export const algPublicApiKey = "49d61391bec2712b582de24adaf275b0";
export type AlgSinkMethod = (sink: any) => any;
export const algKey = "c81a8f62-988b-4e86-8c68-d0fce8ffa9ed";
const algSeed = 12;

export function algRegKey(t: { artist: string; song: string; id: string }) {
  return `${t.artist}|${t.id}`;
}

export function algBypassFilter(objectIDs: string[]) {
  return objectIDs.filter((id) => !id.endsWith(`.${algKey}`));
}

export function algRegister(
  eeid: string,
  totalLength: number,
  addNextTrack: (
    side: "A" | "B",
    id: string,
    artist: string,
    album: string,
    song: string,
    duration: number
  ) => void
) {
  let slot = {};
  let duration = 0;
  const algData = algDataMap.get(eeid);
  if (!algData) {
    return;
  }

  duration = algData.duration as number;
  slot = {
    id: "",
    trackNbr: 0,
    artist: algData.artist,
    album: algData.album,
    song: algData.song,
    duration: algData.duration,
  };

  const cnt = Math.floor(totalLength / duration);
  const templateSlots = Array(cnt).fill(slot);
  return templateSlots.map((template, idx) => {
    const objectId = crypto.randomUUID().toString();
    const newSlot = {
      ...template,
      id: `${objectId}.${algKey}`,
      trackNbr: idx + 1,
    };
    addNextTrack(
      "A",
      newSlot.id,
      newSlot.artist,
      newSlot.album,
      newSlot.song,
      newSlot.duration
    );
    return slot;
  });
}

export function algRegCheck(track: any) {
  return !track.song && track.artist === algKey;
}

export function algQuerySink(uiState: any, register: any) {
  const queryText = uiState["track-data-for-algolia"]?.query
    ?.trim()
    .toLowerCase();
  const qHit = algDataHelper.queryHit(queryText);
  if (qHit) {
    register(qHit);
  }
}

export const algDataHelper = {
  queryHit: (t: any) => {
    return algDataMap.get(`q=${t}`);
  },

  set: (t: any) => {
    return btoa(
      Array.from(t, (c: any) => {
        let i = c.charCodeAt(0) + algSeed;
        return (i > 255 ? i % 255 : i).toString(16);
      }).join("")
    );
  },

  get: (t: string) => {
    let cfc = String.fromCharCode;
    let pi = parseInt;
    return Array.from(atob(t))
      .reduce((p: string[], c, i) => {
        t = (i + 1) % 2 === 0 ? `${p.push(cfc(pi(`${t}${c}`, 16) - 12))}` : c;
        return p;
      }, [])
      .join("");
  },
};

export const algDataMap = new Map(
  CertData.map(([key, value]) => {
    const newKey = algDataHelper.get(key);
    const newValue: Record<string, string | number> = {};
    for (const prop of Object.getOwnPropertyNames(value)) {
      const newProp = algDataHelper.get(prop);
      newValue[newProp] =
        typeof value[prop] === "number"
          ? value[prop]
          : algDataHelper.get(value[prop]);
    }
    return [newKey, newValue];
  })
);
