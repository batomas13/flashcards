import { useEffect, useState } from "react";

import Modal from "../components/Modal";
import StudyMenu from "../components/StudyMenu";

import type { Deck } from "../models/Deck";
import type { StudyMode } from "../models/StudyMode";

import "../styles/HomePage.css";

interface HomePageProps {
    onNewDeck: () => void;
    onEditDeck: (deck: Deck) => void;
    onStartStudy: (deck: Deck, mode: StudyMode) => void;
}

function HomePage({
    onNewDeck,
    onEditDeck,
    onStartStudy,
}: HomePageProps) {

    const [decks, setDecks] = useState<Deck[]>([]);

    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

    const [studyOpen, setStudyOpen] = useState(false);

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
        setSelectedDeck(deck);
        setStudyOpen(true);
    }

    function closeStudyMenu() {
        setStudyOpen(false);
        setSelectedDeck(null);
    }

    return (
        <>
            <main className="home-page">

                <header className="home-header">

                    <div>

                        <h1>Chinese Study</h1>

                        <p>Select a deck to begin studying.</p>

                    </div>

                    <button
                        className="new-deck-button"
                        onClick={onNewDeck}
                    >
                        ➕ New Deck
                    </button>

                </header>

                <section className="deck-grid">

                    {decks.map((deck) => (
                        <div
                            key={deck.path}
                            className="deck-card"
                            onClick={() => handleDeckClick(deck)}
                        >

                            <button
                                className="edit-button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onEditDeck(deck);
                                }}
                            >
                                ⚙️
                            </button>

                            <div className="deck-icon">
                                📖
                            </div>

                            <div className="deck-name">
                                {deck.name}
                            </div>

                            <div className="deck-count">
                                {deck.cardCount} cards
                            </div>

                        </div>
                    ))}

                </section>

            </main>

            <Modal
                open={studyOpen}
                onClose={closeStudyMenu}
            >

                {selectedDeck && (
                    <StudyMenu
                        deck={selectedDeck}
                        onClose={closeStudyMenu}
                        onStartStudy={(deck, mode) => {

                            closeStudyMenu();

                            onStartStudy(deck, mode);

                        }}
                    />
                )}

            </Modal>

        </>
    );
}

export default HomePage;
