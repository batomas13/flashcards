"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  decks: {
    load: () => electron.ipcRenderer.invoke("decks:load")
  }
});
