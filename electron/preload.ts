import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("api", {
    decks: {
        load: () =>
            ipcRenderer.invoke("decks:load"),

        getCards: (filePath: string) =>
            ipcRenderer.invoke(
                "decks:getCards",
                filePath
            ),

        getDeckContent: (filePath: string) =>
            ipcRenderer.invoke(
                "decks:getDeckContent",
                filePath
            ),

        save: (
            filePath: string,
            contents: string
        ) =>
            ipcRenderer.invoke(
                "decks:save",
                filePath,
                contents
            ),
        create: (
            deckName: string,
            contents: string
        ) =>
            ipcRenderer.invoke(
                "decks:create",
                deckName,
                contents
            ),
        delete: (filePaths: string[]) =>
            ipcRenderer.invoke(
                "decks:delete",
                filePaths
            ),
    },
});
