import { useLayoutEffect, useRef } from "react";
import { algDataMap } from "../../data/algolia";

interface ICustomSinkProps {
  algDataKey: string;
  setShowDisplay: React.Dispatch<React.SetStateAction<string>>;
}

export default function CustomSink({
  algDataKey,
  setShowDisplay,
}: ICustomSinkProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    if (dialogRef.current?.open && !algDataKey) {
      dialogRef.current.close();
      setShowDisplay("");
    } else if (!dialogRef.current?.open && algDataKey) {
      dialogRef.current?.showModal();
    }
  }, [algDataKey, setShowDisplay]);

  const algData = algDataMap.get(algDataKey);

  if (!algData) {
    return <></>;
  }

  const title = algData.title;
  const msg = algData.msg;
  const vu = algData.vu as string;

  return (
    <dialog ref={dialogRef}>
      <div
        style={{
          position: "absolute",
          backgroundColor: "transparent",
          minHeight: "100%",
          width: "100%",
        }}
      ></div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h2>{title}</h2>
        <p>{msg}</p>
        <iframe
          width="560"
          height="315"
          src={vu}
          frameBorder={0}
          title="Traxell Mixtapes"
          allow="autoplay;"
          referrerPolicy="strict-origin-when-cross-origin"
        ></iframe>
        <h3>Hit Esc to close dialog</h3>
      </div>
    </dialog>
  );
}
