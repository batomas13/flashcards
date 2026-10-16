import { useCallback, useEffect, useState } from "react";

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

const PAGE_TURN_DURATION = 800;

function StudyPage({
    deck,
    mode,
    onBack,
}: StudyPageProps) {

    const [session, setSession] =
        useState<StudySession | null>(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [open, setOpen] = useState(false);

    const [animation, setAnimation] =
        useState<CardAnimation>(null);

    const [changingCard, setChangingCard] = useState(false);

    const loadStudySession = useCallback(async (): Promise<StudySession> => {
        const cards: FlashCard[] =
            await window.api.decks.getCards(deck.path);

        return createStudySession(cards, mode);
    }, [deck.path, mode]);

    useEffect(() => {

        loadStudySession().then(setSession);

    }, [loadStudySession]);

    const toggleCard = useCallback(() => {
        if (changingCard) {
            return;
        }

        setOpen((previous) => !previous);
    }, [changingCard]);

    const previousCard = useCallback(() => {

        if (!session || currentIndex === 0 || changingCard) {
            return;
        }

        setChangingCard(true);

        setOpen(false);

        setAnimation("previous-close");

        setTimeout(() => {

            setCurrentIndex((previous) => previous - 1);

            setAnimation("previous-open");

            setTimeout(() => {

                setAnimation(null);

                setChangingCard(false);

            }, PAGE_TURN_DURATION / 2);

        }, PAGE_TURN_DURATION / 2);
    }, [changingCard, currentIndex, session]);

    const nextCard = useCallback(() => {

        if (!session || changingCard) {
            return;
        }

        const isFinalCard =
            currentIndex === session.cards.length - 1;

        setChangingCard(true);

        setOpen(false);

        setAnimation("next-close");

        setTimeout(async () => {

            if (isFinalCard) {
                try {
                    const reloadedSession =
                        await loadStudySession();

                    setSession(reloadedSession);
                    setCurrentIndex(0);
                } catch (error) {
                    console.error(
                        "Failed to reload deck:",
                        error
                    );
                }
            } else {
                setCurrentIndex((previous) => previous + 1);
            }

            setAnimation("next-open");

            setTimeout(() => {

                setAnimation(null);

                setChangingCard(false);

            }, PAGE_TURN_DURATION / 2);

        }, PAGE_TURN_DURATION / 2);
    }, [changingCard, currentIndex, loadStudySession, session]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            if (event.code === "Space") {
                event.preventDefault();
                toggleCard();
                return;
            }

            if (
                event.key === "Enter" ||
                event.key === "ArrowRight"
            ) {
                event.preventDefault();
                nextCard();
                return;
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                previousCard();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [nextCard, previousCard, toggleCard]);

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
                    disabled={changingCard}
                >
                    ← Previous
                </button>

                <button
                    className="button button-primary"
                    onClick={nextCard}
                    disabled={changingCard}
                >
                    Next →
                </button>

            </div>

        </main>
    );
}

export default StudyPage;
