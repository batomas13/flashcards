import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import { DeckManager } from "./services/DeckManager"
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
let deckManager: DeckManager;

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

interface AppSettings {
  decksPath: string;
}

function getSettingsPath(): string {
  return path.join(app.getPath("userData"), "settings.json");
}

async function getDecksPath(): Promise<string | undefined> {
  try {
    const settings = JSON.parse(
      await fs.readFile(getSettingsPath(), "utf-8")
    ) as Partial<AppSettings>;

    if (typeof settings.decksPath !== "string") {
      return undefined;
    }

    const folder = await fs.stat(settings.decksPath);
    return folder.isDirectory() ? settings.decksPath : undefined;
  } catch {
    return undefined;
  }
}

async function selectDecksPath(): Promise<string | undefined> {
  const savedPath = await getDecksPath();

  if (savedPath) {
    return savedPath;
  }

  const result = await dialog.showOpenDialog({
    title: "Choose a folder for your flashcard decks",
    buttonLabel: "Use this folder",
    properties: ["openDirectory", "createDirectory"],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return undefined;
  }

  const decksPath = result.filePaths[0];
  await fs.writeFile(
    getSettingsPath(),
    JSON.stringify({ decksPath }, null, 2),
    "utf-8"
  );

  return decksPath;
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,

    minWidth: 900,
    minHeight: 650,

    //frame: false,

    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),

    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  win.removeMenu();

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle("decks:load", async () => {
    return deckManager.getDecks();
});

ipcMain.handle("decks:getCards", async (_, filePath: string) => {
    return deckManager.getCards(filePath);
});

ipcMain.handle("decks:getDeckContent", async (_, filePath: string) => {
    return deckManager.getDeckContent(filePath);
});

ipcMain.handle(
    "decks:save",
    async (_, filePath: string, contents: string) => {

        await deckManager.saveDeck(
            filePath,
            contents
        );
    }
);

ipcMain.handle(
    "decks:create",
    async (
        _,
        deckName: string,
        contents: string
    ) => {

        await deckManager.createDeck(
            deckName,
            contents
        );
    }
);

ipcMain.handle(
    "decks:delete",
    async (_, filePaths: string[]) => {
        await deckManager.deleteDecks(filePaths);
    }
);

app.whenReady().then(async () => {
  const decksPath = await selectDecksPath();

  if (!decksPath) {
    app.quit();
    return;
  }

  deckManager = new DeckManager(decksPath);
  createWindow();
})
