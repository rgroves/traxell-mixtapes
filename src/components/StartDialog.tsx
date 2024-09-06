// TODO DELETE - UNUSED COMPONENT
import { useLayoutEffect, useRef, useState } from "react";

interface IStartDialogProps {
  show: boolean;
  setShowStartModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function StartDialog({
  show,
  setShowStartModal,
}: IStartDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [htmlOverflow, setHtmlOverflow] = useState<string | undefined>();

  useLayoutEffect(() => {
    if (dialogRef.current?.open && !show) {
      dialogRef.current.close();

      if (document.body.parentElement) {
        document.body.parentElement.style.overflow = htmlOverflow ?? "auto";
      }
      setShowStartModal(false);
    } else if (!dialogRef.current?.open && show) {
      const originalHtmlOverflow = document.body.parentElement?.style.overflow;
      setHtmlOverflow(originalHtmlOverflow);
      if (document.body.parentElement) {
        document.body.parentElement.style.overflow = "hidden";
      }
      dialogRef.current?.showModal();
    }
  }, [show, setShowStartModal, htmlOverflow]);

  return (
    <dialog ref={dialogRef} className="start-dialog" style={{ width: "70ch" }}>
      <h2>Ready To Create Your Mixtape?</h2>
      <p>
        Modern digital playlists are great, you can add as many songs as you
        want without constraints. Create a playlist with 200+ songs, no problem.
        Create a playlist with every popular song from a specific genre and time
        period, no problem. But does that lead to a compelling listening
        experience?
      </p>
      <p>
        Compare this to the old school mixtape. You had a limited amount of tape
        time to fill with songs. You had two sides to the tape, one side could
        flow into the next or you could craft a musical narrative for each side.
      </p>
      <p>
        Given 60 minutes, 30 minutes each side, how will you craft your mixtape?
      </p>
      <form>
        <label htmlFor="mixtape-title">Enter A Title For Your Mixtape : </label>
        <input id="mixtape-title" autoFocus={true} />
      </form>
      <button
        onClick={() => {
          setShowStartModal(false);
        }}
      >
        Start
      </button>
    </dialog>
  );
}
