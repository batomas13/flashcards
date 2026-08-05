declare global {
  interface Window {
    api: {
      decks: {
        load(): Promise<any>;
      };
    };
  }
}

export {};
