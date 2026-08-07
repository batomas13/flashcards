import { useState } from "react";

import Header from "../components/Header";
import Card from "../components/Card";

import type { Deck } from "../models/Deck";
import type { Card as FlashCard } from "../models/Card";
import type { StudyMode } from "../models/StudyMode";
import type { CardAnimation } from "../models/CardAnimation";

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

    // Temporary mock data until the backend is ready
    const cards: FlashCard[] = [
        {
            hanzi: "你",
            pinyin: "nǐ",
        },
        {
            hanzi: "我",
            pinyin: "wǒ",
        },
        {
            hanzi: "他",
            pinyin: "tā",
        },
    ];

    const PAGE_TURN_DURATION = 800;

    const [currentIndex, setCurrentIndex] = useState(0);

    const [open, setOpen] = useState(false);

    const [animation, setAnimation] =
        useState<CardAnimation>(null);

    const currentCard = cards[currentIndex];

    const front =
        mode === "hanzi"
            ? currentCard.hanzi
            : currentCard.pinyin;

    const back =
        mode === "hanzi"
            ? currentCard.pinyin
            : currentCard.hanzi;

    function toggleCard() {
        setOpen((previous) => !previous);
    }

    function previousCard() {

        if (currentIndex === 0) {
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

        if (currentIndex === cards.length - 1) {
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

    return (
        <main className="study-page">

            <Header
                title={deck.name}
                onBack={onBack}
            />

            <p className="study-progress">
                Card {currentIndex + 1} / {cards.length}
            </p>

            <Card
                front={front}
                back={back}
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
