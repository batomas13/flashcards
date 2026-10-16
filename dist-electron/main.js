import { app, BrowserWindow, ipcMain, dialog } from "electron";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
class DeckManager {
  constructor(decksPath) {
    this.decksPath = decksPath;
  }
  async getCardsCount(filePath) {
    const contents = await fs.readFile(
      filePath,
      "utf-8"
    );
    return contents.split(/\r?\n/).map((line) => line.trim()).filter((line) => line !== "").length;
  }
  async getCards(filePath) {
    const contents = await fs.readFile(
      filePath,
      "utf-8"
    );
    return contents.split(/\r?\n/).map((line) => line.trim()).filter((line) => line !== "").map((line) => {
      const [hanzi, pinyin] = line.split(":");
      return {
        hanzi,
        pinyin
      };
    });
  }
  async getDeckContent(filePath) {
    return fs.readFile(
      filePath,
      "utf-8"
    );
  }
  async saveDeck(filePath, contents) {
    await fs.writeFile(
      filePath,
      contents,
      "utf-8"
    );
  }
  async createDeck(deckName, contents) {
    const filePath = path.join(
      this.decksPath,
      `${deckName}.txt`
    );
    try {
      await fs.access(filePath);
      throw new Error(
        "A deck with this name already exists."
      );
    } catch (error) {
      if (!(error instanceof Error) || error.code !== "ENOENT") {
        throw error;
      }
    }
    await fs.writeFile(
      filePath,
      contents,
      "utf-8"
    );
  }
  async deleteDecks(filePaths) {
    for (const filePath of filePaths) {
      const relativePath = path.relative(
        this.decksPath,
        filePath
      );
      if (relativePath === "" || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath) || path.extname(filePath) !== ".txt") {
        throw new Error("Invalid deck path.");
      }
    }
    await Promise.all(
      filePaths.map((filePath) => fs.unlink(filePath))
    );
  }
  async getDecks() {
    const files = await fs.readdir(this.decksPath);
    const deckFiles = files.filter(
      (file) => file.endsWith(".txt")
    );
    const decks = [];
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
        )
      });
    }
    return decks;
  }
}
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
let deckManager;
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function getSettingsPath() {
  return path.join(app.getPath("userData"), "settings.json");
}
async function getDecksPath() {
  try {
    const settings = JSON.parse(
      await fs.readFile(getSettingsPath(), "utf-8")
    );
    if (typeof settings.decksPath !== "string") {
      return void 0;
    }
    const folder = await fs.stat(settings.decksPath);
    return folder.isDirectory() ? settings.decksPath : void 0;
  } catch {
    return void 0;
  }
}
async function selectDecksPath() {
  const savedPath = await getDecksPath();
  if (savedPath) {
    return savedPath;
  }
  const result = await dialog.showOpenDialog({
    title: "Choose a folder for your flashcard decks",
    buttonLabel: "Use this folder",
    properties: ["openDirectory", "createDirectory"]
  });
  if (result.canceled || result.filePaths.length === 0) {
    return void 0;
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
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.removeMenu();
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.handle("decks:load", async () => {
  return deckManager.getDecks();
});
ipcMain.handle("decks:getCards", async (_, filePath) => {
  return deckManager.getCards(filePath);
});
ipcMain.handle("decks:getDeckContent", async (_, filePath) => {
  return deckManager.getDeckContent(filePath);
});
ipcMain.handle(
  "decks:save",
  async (_, filePath, contents) => {
    await deckManager.saveDeck(
      filePath,
      contents
    );
  }
);
ipcMain.handle(
  "decks:create",
  async (_, deckName, contents) => {
    await deckManager.createDeck(
      deckName,
      contents
    );
  }
);
ipcMain.handle(
  "decks:delete",
  async (_, filePaths) => {
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
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
