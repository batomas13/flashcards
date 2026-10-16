import type { Card } from "../models/Card";
import type { Deck } from "../models/Deck";

declare global {
    interface Window {
        api: {
            decks: {
                load(): Promise<Deck[]>;
                getCards(filePath: string): Promise<Card[]>;
                getDeckContent(filePath: string): Promise<string>;
                save(
                    filePath: string,
                    contents: string
                ): Promise<void>;
                create(
                    deckName: string,
                    contents: string
                ): Promise<void>;
                delete(filePaths: string[]): Promise<void>;
            };
        };
    }
}

export {};
