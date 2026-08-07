import { useState } from "react";

import type { Deck } from "../models/Deck";

import Header from "../components/Header";

import "../styles/DeckEditorPage.css";
import "../styles/Button.css";

interface DeckEditorPageProps {
    deck?: Deck;
    onBack: () => void;
}

function DeckEditorPage({
    deck,
    onBack,
}: DeckEditorPageProps) {

    const [deckName, setDeckName] = useState(
        deck?.name ?? ""
    );

    const [cards, setCards] = useState("");

    return (
        <main className="deck-editor-page">

            <Header
                title={deck ? "Edit Deck" : "New Deck"}
                onBack={onBack}
            />

            <label>
                Deck Name
            </label>

            <input
                className="deck-name-input"
                value={deckName}
                onChange={(event) =>
                    setDeckName(event.target.value)
                }
            />

            <label>
                Cards
            </label>

            <div className="cards-editor">

                <div className="line-numbers">

                    {cards.split("\n").map((_, index) => (
                        <div key={index}>
                            {index + 1}
                        </div>
                    ))}

                </div>

                <textarea
                    className="cards-textarea"
                    value={cards}
                    spellCheck={false}
                    onChange={(event) =>
                        setCards(event.target.value)
                    }
                />

            </div>

            <div className="editor-actions">

                <button
                    className="button button-secondary"
                    onClick={onBack}
                >
                    Cancel
                </button>

                <button
                    className="button button-primary"
                >
                    Save
                </button>

            </div>

        </main>
    );
}

export default DeckEditorPage;
