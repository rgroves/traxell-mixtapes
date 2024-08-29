import { useLayoutEffect, useRef } from "react";
import { IMixtapeTrack } from "../data/Mixtape";

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

  const msg = "This is just a demo. You can't actually purchase these tracks.";
  const subTotalCost = 0.99 * tracks.length;
  const fee = 5.99;
  const totalCost = 0.99 * tracks.length + 5.99;

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
            <div className="total-detail">Sub-Total:</div>
            <div className="total-cost">${subTotalCost.toFixed(2)}</div>
          </li>
          <li className="fee">
            <div className="fee-detail">
              Having Thoughts About Ownership/Physical Media Fee:
            </div>
            <div className="fee-cost">${fee.toFixed(2)}</div>
          </li>
          <li className="total-line">
            <div className="total-detail">Total:</div>
            <div className="total-cost">${totalCost.toFixed(2)}</div>
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
