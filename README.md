# Chinese Study

A desktop flashcard application for studying Chinese vocabulary.

Built with **Electron**, **React**, **TypeScript**, and **Vite**.

---

## Features

- Create flashcard decks
- Edit flashcard decks
- Study Hanzi
- Study Pinyin
- Import decks
- Export decks

---

## Project Structure

```text
project/
│
├── decks/
│   ├── HSK1.txt
│   ├── HSK2.txt
│   └── ...
│
├── electron/
│   ├── DeckManager.ts
│   ├── main.ts
│   └── preload.ts
│
├── src/
│   ├── components/
│   ├── models/
│   ├── pages/
│   ├── styles/
│   └── App.tsx
│
└── README.md
```

---

## Deck Format

Each deck is stored as a plain text file.

Example:

```txt
你:ni
我:wo
他:ta
她:ta
```

Format:

```txt
hanzi:pinyin
```

One flashcard per line.
