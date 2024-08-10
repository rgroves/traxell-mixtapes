import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <main>
        <h1>Traxell Mixtapes</h1>
        <p>Can you craft the perfect mixtape?</p>
      </main>
    </>
  );
}

export default App;
