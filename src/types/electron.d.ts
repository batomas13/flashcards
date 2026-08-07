import type { Deck } from "../models/Deck";
import type { Card } from "../models/Card";

declare global {
    interface Window {
        api: {
            decks: {
                load(): Promise<Deck[]>;
                getCards(filePath: string): Promise<Card[]>;
            };
        };
    }
}

export {};
