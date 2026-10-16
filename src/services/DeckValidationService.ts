export interface ValidationError {
    message: string;
    line?: number;
}

export function validateDeckName(
    deckName: string
): ValidationError | null {

    if (deckName.trim() === "") {
        return {
            message: "Deck name cannot be empty.",
        };
    }

    return null;
}

export function validateCards(
    cards: string
): ValidationError | null {

    const lines = cards
        .split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i].trim();

        if (line === "") {
            continue;
        }

        const parts = line.split(":");

        if (
            parts.length !== 2 ||
            parts[0].trim() === "" ||
            parts[1].trim() === ""
        ) {
            return {
                message: "Use X:Y format.",
                line: i + 1,
            };
        }
    }

    return null;
}
