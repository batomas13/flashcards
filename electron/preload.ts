import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('api', {
  decks: {
    load: () => ipcRenderer.invoke("decks:load"),
  }
})
