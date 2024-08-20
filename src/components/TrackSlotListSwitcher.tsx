interface ITrackSlotListSwitcherProps {
  iconDir: "up" | "down";
  onClick: () => void;
}

export default function TrackSlotListSwitcher({
  iconDir = "down",
  onClick,
}: ITrackSlotListSwitcherProps) {
  const msg =
    iconDir === "down"
      ? "↙️ Switch Active Side ↘️"
      : "↖️ Switch Active Side ↗️";

  return <button onClick={onClick}>{msg}</button>;
}
