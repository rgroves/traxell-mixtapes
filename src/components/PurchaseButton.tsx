import { ReactNode } from "react";
import "./PurchaseButton.css";

interface IPurchaseButtonProps {
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}
export default function PurchaseButton({
  disabled,
  onClick,
  children,
}: IPurchaseButtonProps) {
  const className = disabled
    ? "purchase-button purchase-button--disabled"
    : "purchase-button";

  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
