import fs from "node:fs/promises";
import path from "node:path";

import type { Deck } from "../../src/models/Deck";
import type { Card } from "../../src/models/Card";

export class DeckManager {

    constructor(
        private readonly decksPath: string,
    ) {}

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

    async getDeckContent(
        filePath: string
    ): Promise<string> {

        return fs.readFile(
            filePath,
            "utf-8"
        );
    }

    async saveDeck(
        filePath: string,
        contents: string
    )   : Promise<void> {

        await fs.writeFile(
            filePath,
            contents,
            "utf-8"
        );
    }

    async createDeck(
        deckName: string,
        contents: string
    ): Promise<void> {

        const filePath = path.join(
            this.decksPath,
            `${deckName}.txt`
        );

        try {

            await fs.access(filePath);

            throw new Error(
                "A deck with this name already exists."
            );

        } catch (error: unknown) {

            if (
                !(error instanceof Error) ||
                (error as NodeJS.ErrnoException).code !== "ENOENT"
            ) {
                throw error;
            }
        }

        await fs.writeFile(
            filePath,
            contents,
            "utf-8"
        );
    }

    async deleteDecks(
        filePaths: string[]
    ): Promise<void> {

        for (const filePath of filePaths) {
            const relativePath = path.relative(
                this.decksPath,
                filePath
            );

            if (
                relativePath === "" ||
                relativePath === ".." ||
                relativePath.startsWith(`..${path.sep}`) ||
                path.isAbsolute(relativePath) ||
                path.extname(filePath) !== ".txt"
            ) {
                throw new Error("Invalid deck path.");
            }
        }

        await Promise.all(
            filePaths.map(filePath => fs.unlink(filePath))
        );
    }

    async getDecks(): Promise<Deck[]> {

        const files = await fs.readdir(this.decksPath);

        const deckFiles = files.filter(
            file => file.endsWith(".txt")
        );

        const decks: Deck[] = [];

        for (const file of deckFiles) {

            const filePath = path.join(
                this.decksPath,
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
