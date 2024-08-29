import { useEffect, useState } from "react";

interface IAlgoliaLogoProps {
  height?: number;
  width?: number;
}

const prefersDarkColorScheme = window.matchMedia(
  "(prefers-color-scheme: dark)"
);

export default function AlgoliaLogo({
  height = 16,
  width = 64,
}: IAlgoliaLogoProps) {
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkColorScheme.matches);

  useEffect(() => {
    setIsDarkMode(prefersDarkColorScheme.matches);
    prefersDarkColorScheme.addEventListener("change", (event) => {
      setIsDarkMode(event.matches);
    });
  }, []);

  const algoliaImage = isDarkMode
    ? "/algolia-logo-white.png"
    : "/algolia-logo-blue.png";

  return (
    <img
      className="algolia-logo"
      src={algoliaImage}
      height={height}
      width={width}
    />
  );
}
