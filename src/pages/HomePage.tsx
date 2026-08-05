import { useEffect, useState } from "react";

import type { Deck } from "../models/Deck";

import "../styles/HomePage.css";

function HomePage() {
    const [decks, setDecks] = useState<Deck[]>([]);

    useEffect(() => {
        loadDecks();
    }, []);

    async function loadDecks() {
        try {
            const loadedDecks = await window.api.decks.load();
            setDecks(loadedDecks);
        } catch (error) {
            console.error("Failed to load decks:", error);
        }
    }

    function handleDeckClick(deck: Deck) {
        console.log("Study:", deck);
    }

    function handleNewDeck() {
        console.log("New Deck");
    }

    function handleEditDeck(deck: Deck) {
        console.log("Edit:", deck);
    }

    return (
        <main className="home-page">

            <header className="home-header">
                <h1>Chinese Study</h1>
                <p>Select a deck to begin studying.</p>
            </header>

            <section className="deck-grid">

                {decks.map(deck => (
                    <div
                        key={deck.path}
                        className="deck-card"
                        onClick={() => handleDeckClick(deck)}
                        role="button"
                        tabIndex={0}
                    >

                        <button
                            className="edit-button"
                            onClick={(event) => {
                                event.stopPropagation();
                                handleEditDeck(deck);
                            }}
                        >
                            ⚙️
                        </button>

                        <div className="deck-name">
                            {deck.name}
                        </div>

                        <div className="deck-count">
                            {deck.cardCount} cards
                        </div>

                    </div>
                ))}

            </section>

            <div className="home-actions">
                <button
                    className="new-deck-button"
                    onClick={handleNewDeck}
                >
                    ➕ New Deck
                </button>
            </div>

        </main>
    );
}

export default HomePage;
