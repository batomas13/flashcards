import { app as c, BrowserWindow as u, ipcMain as l, dialog as g } from "electron";
import r from "node:fs/promises";
import a from "node:path";
import { fileURLToPath as m } from "node:url";
class y {
  constructor(e) {
    this.decksPath = e;
  }
  async getCardsCount(e) {
    return (await r.readFile(
      e,
      "utf-8"
    )).split(/\r?\n/).map((t) => t.trim()).filter((t) => t !== "").length;
  }
  async getCards(e) {
    return (await r.readFile(
      e,
      "utf-8"
    )).split(/\r?\n/).map((t) => t.trim()).filter((t) => t !== "").map((t) => {
      const [i, h] = t.split(":");
      return {
        hanzi: i,
        pinyin: h
      };
    });
  }
  async getDeckContent(e) {
    return r.readFile(
      e,
      "utf-8"
    );
  }
  async saveDeck(e, n) {
    await r.writeFile(
      e,
      n,
      "utf-8"
    );
  }
  async createDeck(e, n) {
    const t = a.join(
      this.decksPath,
      `${e}.txt`
    );
    try {
      throw await r.access(t), new Error(
        "A deck with this name already exists."
      );
    } catch (i) {
      if (!(i instanceof Error) || i.code !== "ENOENT")
        throw i;
    }
    await r.writeFile(
      t,
      n,
      "utf-8"
    );
  }
  async deleteDecks(e) {
    for (const n of e) {
      const t = a.relative(
        this.decksPath,
        n
      );
      if (t === "" || t === ".." || t.startsWith(`..${a.sep}`) || a.isAbsolute(t) || a.extname(n) !== ".txt")
        throw new Error("Invalid deck path.");
    }
    await Promise.all(
      e.map((n) => r.unlink(n))
    );
  }
  async getDecks() {
    const n = (await r.readdir(this.decksPath)).filter(
      (i) => i.endsWith(".txt")
    ), t = [];
    for (const i of n) {
      const h = a.join(
        this.decksPath,
        i
      );
      t.push({
        name: a.parse(i).name,
        path: h,
        cardCount: await this.getCardsCount(
          h
        )
      });
    }
    return t;
  }
}
const p = a.dirname(m(import.meta.url));
let o;
process.env.APP_ROOT = a.join(p, "..");
const f = process.env.VITE_DEV_SERVER_URL, j = a.join(process.env.APP_ROOT, "dist-electron"), w = a.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = f ? a.join(process.env.APP_ROOT, "public") : w;
let d;
function k() {
  return a.join(c.getPath("userData"), "settings.json");
}
async function D() {
  try {
    const s = JSON.parse(
      await r.readFile(k(), "utf-8")
    );
    return typeof s.decksPath != "string" ? void 0 : (await r.stat(s.decksPath)).isDirectory() ? s.decksPath : void 0;
  } catch {
    return;
  }
}
async function v() {
  const s = await D();
  if (s)
    return s;
  const e = await g.showOpenDialog({
    title: "Choose a folder for your flashcard decks",
    buttonLabel: "Use this folder",
    properties: ["openDirectory", "createDirectory"]
  });
  if (e.canceled || e.filePaths.length === 0)
    return;
  const n = e.filePaths[0];
  return await r.writeFile(
    k(),
    JSON.stringify({ decksPath: n }, null, 2),
    "utf-8"
  ), n;
}
function P() {
  d = new u({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    //frame: false,
    icon: a.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: a.join(p, "preload.mjs")
    }
  }), d.removeMenu(), f ? d.loadURL(f) : d.loadFile(a.join(w, "index.html"));
}
c.on("window-all-closed", () => {
  process.platform !== "darwin" && (c.quit(), d = null);
});
c.on("activate", () => {
  u.getAllWindows().length === 0 && P();
});
l.handle("decks:load", async () => o.getDecks());
l.handle("decks:getCards", async (s, e) => o.getCards(e));
l.handle("decks:getDeckContent", async (s, e) => o.getDeckContent(e));
l.handle(
  "decks:save",
  async (s, e, n) => {
    await o.saveDeck(
      e,
      n
    );
  }
);
l.handle(
  "decks:create",
  async (s, e, n) => {
    await o.createDeck(
      e,
      n
    );
  }
);
l.handle(
  "decks:delete",
  async (s, e) => {
    await o.deleteDecks(e);
  }
);
c.whenReady().then(async () => {
  const s = await v();
  if (!s) {
    c.quit();
    return;
  }
  o = new y(s), P();
});
export {
  j as MAIN_DIST,
  w as RENDERER_DIST,
  f as VITE_DEV_SERVER_URL
};
