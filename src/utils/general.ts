export function formatSecondsToTimeDisplay(duration: number): string {
  const SECONDS_IN_1_HOUR = 3600;
  const SECONDS_IN_24_HOURS = 86400;
  const SECONDS_IN_1_MINUTE = 60;
  let displayTime;

  if (duration > SECONDS_IN_24_HOURS) {
    displayTime = "[WO:AH:!!]";
  } else if (duration === 0) {
    displayTime = "[0:00]";
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
    displayTime = `[${hh}${mm}${ss}]`;
  }

  return displayTime;
}

export function forceHttps(url: string) {
  return url.startsWith("https:") ? url : url.replace("http:", "https:");
}

/**
 * The code below from Algolia Samples:
 * https://github.com/algolia/doc-code-samples/tree/master/react-instantsearch/facet-dropdown
 */
import { Children, isValidElement, ReactNode } from "react";

export function cx(
  ...classNames: (string | number | boolean | undefined | null)[]
) {
  return classNames.filter(Boolean).join(" ");
}

export function capitalize(value: string) {
  if (typeof value !== "string") return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getFirstChildPropValue(
  children: ReactNode,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  propNameCb: (props: any) => string
): string | string[] | undefined {
  let propValue = undefined;

  Children.forEach(children, (element) => {
    if (!isValidElement(element)) return;
    const propName = propNameCb(element.props);
    if (propName in element.props) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      propValue = element.props[propName];
      return;
    }
  });

  return propValue;
}
