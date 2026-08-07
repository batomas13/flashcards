"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  decks: {
    load: () => electron.ipcRenderer.invoke("decks:load"),
    getCards: (filePath) => electron.ipcRenderer.invoke("decks:getCards", filePath)
  }
});
