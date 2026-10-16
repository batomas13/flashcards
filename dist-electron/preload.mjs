"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  decks: {
    load: () => electron.ipcRenderer.invoke("decks:load"),
    getCards: (filePath) => electron.ipcRenderer.invoke(
      "decks:getCards",
      filePath
    ),
    getDeckContent: (filePath) => electron.ipcRenderer.invoke(
      "decks:getDeckContent",
      filePath
    ),
    save: (filePath, contents) => electron.ipcRenderer.invoke(
      "decks:save",
      filePath,
      contents
    ),
    create: (deckName, contents) => electron.ipcRenderer.invoke(
      "decks:create",
      deckName,
      contents
    ),
    delete: (filePaths) => electron.ipcRenderer.invoke(
      "decks:delete",
      filePaths
    )
  }
});
