import fs from "node:fs/promises";
import path from "node:path";

import type { Deck } from "../../src/models/Deck";

export class DeckManager {
    private async getCardsCount(filePath: string): Promise<number>{
        const contents = await fs.readFile(filePath, "utf-8");
        return contents
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== "")
            .length;
    };

    async getDecks(): Promise<Deck[]> {
        const decksPath = path.join(process.cwd(), "decks");

        const files = await fs.readdir(decksPath);

        const deckFiles = files.filter(file => file.endsWith(".txt"));

        const decks: Deck[] = [];

        for (const file of deckFiles) {

            const filePath = path.join(decksPath, file);

            decks.push({
                name: path.parse(file).name,
                path: filePath,
                cardCount: await this.getCardsCount(filePath),
            });
        }
        return decks;    
    };
}

