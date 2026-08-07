import { useEffect, useState } from "react";

import Header from "../components/Header";
import Card from "../components/Card";

import type { Deck } from "../models/Deck";
import type { Card as FlashCard } from "../models/Card";
import type { StudyMode } from "../models/StudyMode";
import type { CardAnimation } from "../models/CardAnimation";

import {
    createStudySession,
    type StudySession,
} from "../services/StudyService";

import "../styles/StudyPage.css";
import "../styles/Button.css";

interface StudyPageProps {
    deck: Deck;
    mode: StudyMode;
    onBack: () => void;
}

function StudyPage({
    deck,
    mode,
    onBack,
}: StudyPageProps) {

    const PAGE_TURN_DURATION = 800;

    const [session, setSession] =
        useState<StudySession | null>(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [open, setOpen] = useState(false);

    const [animation, setAnimation] =
        useState<CardAnimation>(null);

    useEffect(() => {

        async function loadStudySession() {

            const cards: FlashCard[] =
                await window.api.decks.getCards(deck.path);

            const studySession =
                createStudySession(cards, mode);

            setSession(studySession);

        }

        loadStudySession();

    }, [deck.path, mode]);

    function toggleCard() {
        setOpen((previous) => !previous);
    }

    function previousCard() {

        if (!session || currentIndex === 0) {
            return;
        }

        setOpen(false);

        setAnimation("previous-close");

        setTimeout(() => {

            setCurrentIndex((previous) => previous - 1);

            setAnimation("previous-open");

            setTimeout(() => {

                setAnimation(null);

            }, PAGE_TURN_DURATION / 2);

        }, PAGE_TURN_DURATION / 2);
    }

    function nextCard() {

        if (
            !session ||
            currentIndex === session.cards.length - 1
        ) {
            return;
        }

        setOpen(false);

        setAnimation("next-close");

        setTimeout(() => {

            setCurrentIndex((previous) => previous + 1);

            setAnimation("next-open");

            setTimeout(() => {

                setAnimation(null);

            }, PAGE_TURN_DURATION / 2);

        }, PAGE_TURN_DURATION / 2);
    }

    if (!session) {
        return (
            <main className="study-page">

                <Header
                    title={deck.name}
                    onBack={onBack}
                />

                <p className="study-progress">
                    Loading cards...
                </p>

            </main>
        );
    }

    const currentCard = session.cards[currentIndex];

    return (
        <main className="study-page">

            <Header
                title={deck.name}
                onBack={onBack}
            />

            <p className="study-progress">
                Card {currentIndex + 1} / {session.cards.length}
            </p>

            <Card
                front={currentCard.front}
                back={currentCard.back}
                open={open}
                animation={animation}
                onToggle={toggleCard}
            />

            <div className="study-actions">

                <button
                    className="button button-secondary"
                    onClick={previousCard}
                >
                    ← Previous
                </button>

                <button
                    className="button button-primary"
                    onClick={nextCard}
                >
                    Next →
                </button>

            </div>

        </main>
    );
}

export default StudyPage;
