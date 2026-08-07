import { useState } from "react";

import HomePage from "./pages/HomePage";
import DeckEditorPage from "./pages/DeckEditorPage";
import StudyPage from "./pages/StudyPage";

import type { Deck } from "./models/Deck";
import type { StudyMode } from "./models/StudyMode";

type Page =
    | "home"
    | "editor"
    | "study";

function App() {

    const [page, setPage] = useState<Page>("home");

    const [selectedDeck, setSelectedDeck] = useState<Deck | undefined>();

    const [studyDeck, setStudyDeck] = useState<Deck>();

    const [studyMode, setStudyMode] = useState<StudyMode>("hanzi");

    function openNewDeck() {

        setSelectedDeck(undefined);

        setPage("editor");

    }

    function openEditDeck(deck: Deck) {

        setSelectedDeck(deck);

        setPage("editor");

    }

    function startStudy(
        deck: Deck,
        mode: StudyMode,
    ) {

        setStudyDeck(deck);

        setStudyMode(mode);

        setPage("study");

    }

    function goHome() {

        setSelectedDeck(undefined);

        setStudyDeck(undefined);

        setPage("home");

    }

    switch (page) {

        case "editor":
            return (
                <DeckEditorPage
                    deck={selectedDeck}
                    onBack={goHome}
                />
            );

        case "study":
            return (
                <StudyPage
                    deck={studyDeck!}
                    mode={studyMode}
                    onBack={goHome}
                />
            );

        case "home":
        default:
            return (
                <HomePage
                    onNewDeck={openNewDeck}
                    onEditDeck={openEditDeck}
                    onStartStudy={startStudy}
                />
            );
    }

}

export default App;
