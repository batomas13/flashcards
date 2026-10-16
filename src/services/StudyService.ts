import type { Card } from "../models/Card";
import type { StudyCard } from "../models/StudyCard";
import type { StudyMode } from "../models/StudyMode";

export interface StudySession {
    cards: StudyCard[];
    mode: StudyMode;
}

export function createStudySession(
    cards: Card[],
    mode: StudyMode,
): StudySession {

    const studyCards = cards.map((card) => {

        if (mode === "hanzi") {
            return {
                front: card.hanzi,
                back: card.pinyin,
            };
        }

        if (mode === "pinyin") {
            return {
                front: card.pinyin,
                back: card.hanzi,
            };
        }

        if (Math.random() < 0.5) {
            return {
                front: card.hanzi,
                back: card.pinyin,
            };
        }

        return {
            front: card.pinyin,
            back: card.hanzi,
        };
    });

    for (let index = studyCards.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(
            Math.random() * (index + 1)
        );

        [studyCards[index], studyCards[randomIndex]] = [
            studyCards[randomIndex],
            studyCards[index],
        ];
    }

    return {
        cards: studyCards,
        mode,
    };
}
