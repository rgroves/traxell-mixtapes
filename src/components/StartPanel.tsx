import { useState } from "react";

interface IStartPanelProps {
  onStart: (mixName: string) => void;
}

export default function StartPanel({ onStart }: IStartPanelProps) {
  const [mixtapeTitle, setMixtapeTitle] = useState("");

  return (
    <>
      <h3>Ready To Create Your Mixtape?</h3>
      <form
        className="start-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (mixtapeTitle) {
            onStart(mixtapeTitle.trim());
          }
          setMixtapeTitle("");
        }}
      >
        <label htmlFor="mixtape-title">Name Your Mix: </label>
        <input
          className="start-form__input"
          id="mixtape-title"
          autoFocus={true}
          onChange={(e) => {
            setMixtapeTitle(e.target.value);
          }}
          value={mixtapeTitle}
        />
        <button
          formAction="submit"
          disabled={mixtapeTitle.trim() === ""}
          className="start-form__submit-btn"
        >
          Start
        </button>
      </form>
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
    </>
  );
}
