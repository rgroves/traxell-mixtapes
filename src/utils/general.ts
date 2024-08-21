export function formatSecondsToTimeDisplay(duration: number): string {
  const SECONDS_IN_1_HOUR = 3600;
  const SECONDS_IN_24_HOURS = 86400;
  const SECONDS_IN_1_MINUTE = 60;
  let displayTime;

  if (duration > SECONDS_IN_24_HOURS) {
    displayTime = "[WO:AH:!!]";
  } else if (duration === 0) {
    displayTime = "[?:??]";
  } else {
    const hours = Math.max(0, Math.floor(duration / SECONDS_IN_1_HOUR));
    const minutes = Math.max(
      0,
      Math.floor((duration % SECONDS_IN_1_HOUR) / SECONDS_IN_1_MINUTE)
    );
    const seconds = duration % 60;

    const hh = hours === 0 ? "" : `${hours.toString().padStart(2, "0")}:`;
    const mm =
      hours === 0 && minutes < 9
        ? `${minutes.toString()}:`
        : `${minutes.toString().padStart(2, "0")}:`;
    const ss = seconds.toString().padStart(2, "0");
    const hhmmss = `${hh}${mm}${ss}`;

    displayTime = `[${hhmmss}]`;
  }

  return displayTime;
}

export function forceHttps(url: string) {
  return url.startsWith("https:") ? url : url.replace("http:", "https:");
}
