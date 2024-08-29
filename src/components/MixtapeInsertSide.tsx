import { ReactElement } from "react";
import { MixtapeSideLabel } from "../data/Mixtape";

interface IMixtapeInsertSideProps {
  children: ReactElement;
  label: MixtapeSideLabel;
}

export default function MixtapeInsertSide({
  children,
  label,
}: IMixtapeInsertSideProps) {
  return (
    <section className="mixtape-insert__side">
      <h2 className="mixtape-insert__side-label">
        <span className="mixtape-insert__side-label-letter">{label}</span> Side
      </h2>
      {children}
    </section>
  );
}
