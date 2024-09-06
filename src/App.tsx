import { useState } from "react";
import aa from "search-insights";
import { algAppId, algPublicApiKey } from "./data/algolia";
import StartPanel from "./components/StartPanel";
import MixtapePanel from "./components/MixtapePanel";

aa("init", { appId: algAppId, apiKey: algPublicApiKey });

export default function App() {
  const [mixtapeTitle, setMixtapeTitle] = useState("");

  return (
    <>
      <header>
        <h1>Traxell Mixtapes</h1>
        <h2>Every special moment deserves a mixtape</h2>
      </header>
      <main>
        {!mixtapeTitle ? (
          <StartPanel
            onStart={(mixName: string) => {
              setMixtapeTitle(mixName);
            }}
          />
        ) : (
          <MixtapePanel
            mixtapeTitle={mixtapeTitle}
            onRestart={() => {
              setMixtapeTitle("");
            }}
          />
        )}
      </main>
      <footer>
        <p>Made with ❤️, 🧠, and ☕ in Chicago, IL, USA.</p>
      </footer>
    </>
  );
}
