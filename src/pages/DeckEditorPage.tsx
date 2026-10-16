import { useEffect, useState } from "react";

import type { Deck } from "../models/Deck";

import Header from "../components/Header";
import Modal from "../components/Modal";

import {
    validateDeckName,
    validateCards,
    type ValidationError,
} from "../services/DeckValidationService";

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

    const [error, setError] =
        useState<ValidationError | null>(null);

    const [confirmSave, setConfirmSave] =
        useState(false);

    const [saved, setSaved] =
        useState(false);

    useEffect(() => {

        const deckToLoad = deck;

        if (!deckToLoad) {
            return;
        }

        const deckPath = deckToLoad.path;

        async function loadDeckContent() {

            const content =
                await window.api.decks.getDeckContent(
                    deckPath
                );

            setCards(content);
        }

        loadDeckContent();

    }, [deck]);

    function handleSave() {

        const nameError =
            validateDeckName(deckName);

        if (nameError) {
            setError(nameError);
            return;
        }

        const cardsError =
            validateCards(cards);

        if (cardsError) {
            setError(cardsError);
            return;
        }

        setError(null);
        setConfirmSave(true);
    }

    async function confirmSaveDeck() {

        setConfirmSave(false);

        try {

            if (deck) {

                await window.api.decks.save(
                    deck.path,
                    cards
                );

            } else {

                await window.api.decks.create(
                    deckName.trim(),
                    cards
                );
            }

            setSaved(true);

            setTimeout(() => {
                setSaved(false);
            }, 2000);

        } catch (error) {

            console.error(
                "Failed to save deck:",
                error
            );

            setError({
                message:
                    error instanceof Error
                        ? error.message
                        : String(error),
            });
        }    
    }

    return (
        <>
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
                    onChange={(event) => {
                        setDeckName(event.target.value);
                        setError(null);
                    }}
                />

                <label>
                    Cards
                </label>

                <div className="cards-editor">

                    <div className="line-numbers">

                        {cards
                            .split(/\r?\n/)
                            .map((_, index) => {

                                const lineNumber =
                                    index + 1;

                                return (
                                    <div
                                        key={lineNumber}
                                        className="line-number"
                                    >

                                        {error?.line ===
                                            lineNumber && (
                                            <span
                                                className="error-dot"
                                            />
                                        )}

                                        {lineNumber}

                                    </div>
                                );
                            })}

                    </div>

                    <textarea
                        className="cards-textarea"
                        value={cards}
                        spellCheck={false}
                        onChange={(event) => {
                            setCards(event.target.value);
                            setError(null);
                        }}
                    />

                </div>

                {error && (
                    <p className="editor-error">
                        {error.message}
                    </p>
                )}

                {saved && (
                    <p className="editor-success">
                        ✓ {deck
                            ? "Deck saved successfully."
                            : "Deck created successfully."}
                    </p>
                )}

                <div className="editor-actions">

                    <button
                        className="button button-secondary"
                        onClick={onBack}
                    >
                        Cancel
                    </button>

                    <button
                        className="button button-primary"
                        onClick={handleSave}
                    >
                        {deck ? "Save" : "Create"}
                    </button>

                </div>

            </main>

            <Modal
                open={confirmSave}
                onClose={() => setConfirmSave(false)}
            >

                <div className="save-confirmation">

                    <h2>
                        {deck
                            ? "Save Changes?"
                            : "Create Deck?"}
                    </h2>

                    <p>
                        {deck
                            ? `Are you sure you want to save these changes to "${deck.name}"?`
                            : `Are you sure you want to create the deck "${deckName.trim()}"?`}
                    </p>

                    <div className="editor-actions">

                        <button
                            className="button button-secondary"
                            onClick={() =>
                                setConfirmSave(false)
                            }
                        >
                            Cancel
                        </button>

                        <button
                            className="button button-primary"
                            onClick={confirmSaveDeck}
                        >
                            {deck ? "Save" : "Create"}
                        </button>

                    </div>

                </div>

            </Modal>
        </>
    );
}

export default DeckEditorPage;
