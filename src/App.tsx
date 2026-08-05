import { useEffect } from "react";

function App() {

  useEffect(() => {

    async function loadDecks() {
      const decks = await window.api.decks.load();

      console.log(decks);
    }

    loadDecks();

  }, []);

  return (
    <h1>Chinese Study</h1>
  );
}

export default App;
