import { ReactNode } from "react";
import { useInstantSearch } from "react-instantsearch";

interface INoResultsBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

export function NoResultsBoundary({
  children,
  fallback,
}: INoResultsBoundaryProps) {
  const { results } = useInstantSearch();

  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

export function NoResults() {
  return (
    <div>
      <p>No tracks available.</p>
    </div>
  );
}
