import fs from "node:fs/promises";
import path from "node:path";

import type { Deck } from "../../src/models/Deck";
import type { Card } from "../../src/models/Card";

export class DeckManager {

    private async getCardsCount(
        filePath: string
    ): Promise<number> {

        const contents = await fs.readFile(
            filePath,
            "utf-8"
        );

        return contents
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line !== "")
            .length;
    }

    async getCards(
        filePath: string
    ): Promise<Card[]> {

        const contents = await fs.readFile(
            filePath,
            "utf-8"
        );

        return contents
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line !== "")
            .map(line => {

                const [hanzi, pinyin] = line.split(":");

                return {
                    hanzi,
                    pinyin,
                };
            });
    }

    async getDecks(): Promise<Deck[]> {

        const decksPath = path.join(
            process.cwd(),
            "decks"
        );

        const files = await fs.readdir(decksPath);

        const deckFiles = files.filter(
            file => file.endsWith(".txt")
        );

        const decks: Deck[] = [];

        for (const file of deckFiles) {

            const filePath = path.join(
                decksPath,
                file
            );

            decks.push({
                name: path.parse(file).name,
                path: filePath,
                cardCount: await this.getCardsCount(
                    filePath
                ),
            });
        }

        return decks;
    }
}
