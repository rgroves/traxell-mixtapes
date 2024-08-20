import { useLayoutEffect, useRef } from "react";
import { IMixtapeTrack } from "../data/Mixtape";
import "./PurchaseDialog.css";

interface IPurchaseDialogProps {
  show: boolean;
  setShowPurchaseModal: React.Dispatch<React.SetStateAction<boolean>>;
  tracks: IMixtapeTrack[];
}

export default function PurchaseDialog({
  show,
  setShowPurchaseModal,
  tracks,
}: IPurchaseDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    if (dialogRef.current?.open && !show) {
      dialogRef.current.close();
      setShowPurchaseModal(false);
    } else if (!dialogRef.current?.open && show) {
      dialogRef.current?.showModal();
    }
  }, [show, setShowPurchaseModal]);

  let msg = "This is just a demo. You can't actually purchase these tracks";

  const totalCost = (0.99 * tracks.length).toFixed(2);

  return (
    <dialog ref={dialogRef} className="purchase-dialog">
      <h2>Checkout</h2>
      <div className="cart">
        <ul className="cart-items">
          {tracks.length > 0 &&
            tracks.map((track) => (
              <li key={track.id} className="cart-item">
                <div className="track-detail">
                  {track.artist} - {track.song}
                </div>
                <div className="track-cost">$0.99</div>
              </li>
            ))}
          <li className="total-line">
            <div className="total-detail">Total Cost:</div>
            <div className="total-cost">${totalCost}</div>
          </li>
        </ul>
      </div>
      <p className="purchase-msg">{msg}</p>
      <button
        onClick={() => {
          setShowPurchaseModal((prev) => !prev);
        }}
      >
        Close
      </button>
    </dialog>
  );
}
