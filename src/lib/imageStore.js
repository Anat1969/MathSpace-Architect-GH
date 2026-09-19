// App-isolated image storage backed by IndexedDB.
//
// Why not localStorage: every GitHub Pages project of this account is served from
// the same origin (anat1969.github.io), and localStorage is a single ~5MB bucket
// shared across ALL of them. It fills up and is easy to collide on.
//
// IndexedDB is also per-origin, but each database is addressed by NAME, so a DB
// named uniquely for this app is fully isolated from every other app's database,
// and its quota is far larger (typically hundreds of MB). That gives us both
// isolation (never touch another app's data) and room (uploads stop failing).

const DB_NAME = 'msa-images';       // unique to MathSpace Architect
const STORE = 'namespaces';         // one record per module namespace
const KNOWN_NS = ['module1', 'module2', 'module3', 'module4', 'module5'];
const LEGACY_KEYS = (ns) => [`msa:images:${ns}`, `images_${ns}`];

const hasIDB = () => typeof indexedDB !== 'undefined';

function openDB() {
  return new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (e) { reject(e); }
  });
}

export async function idbGet(ns) {
  if (!hasIDB()) return null;
  try {
    const db = await openDB();
    return await new Promise((res, rej) => {
      const t = db.transaction(STORE, 'readonly');
      const r = t.objectStore(STORE).get(ns);
      r.onsuccess = () => res(r.result || null);
      r.onerror = () => rej(r.error);
    });
  } catch { return null; }
}

export async function idbSet(ns, value) {
  if (!hasIDB()) throw new Error('IndexedDB unavailable');
  const db = await openDB();
  return await new Promise((res, rej) => {
    const t = db.transaction(STORE, 'readwrite');
    t.objectStore(STORE).put(value, ns);
    t.oncomplete = () => res(true);
    t.onerror = () => rej(t.error);
    t.onabort = () => rej(t.error);
  });
}

export async function idbDelete(ns) {
  if (!hasIDB()) return;
  try {
    const db = await openDB();
    await new Promise((res) => {
      const t = db.transaction(STORE, 'readwrite');
      t.objectStore(STORE).delete(ns);
      t.oncomplete = () => res();
      t.onerror = () => res();
    });
  } catch { /* ignore */ }
}

// One-time move of this app's images out of the old localStorage keys into IDB,
// then clear those localStorage keys so the shared 5MB bucket is freed. Only
// touches THIS app's own keys — never another app's data.
export async function migrateNamespace(ns) {
  if (!hasIDB()) return;
  try {
    const existing = await idbGet(ns);
    if (existing == null) {
      for (const k of LEGACY_KEYS(ns)) {
        let raw = null;
        try { raw = localStorage.getItem(k); } catch { /* ignore */ }
        if (raw != null) {
          try { await idbSet(ns, JSON.parse(raw)); } catch { /* ignore */ }
          break;
        }
      }
    }
    for (const k of LEGACY_KEYS(ns)) {
      try { localStorage.removeItem(k); } catch { /* ignore */ }
    }
  } catch { /* ignore */ }
}

// Remove ALL of this app's stored images (IndexedDB store + any leftover
// localStorage keys for this app). Never touches another app's data.
export async function clearAppImages() {
  try {
    if (hasIDB()) {
      const db = await openDB();
      await new Promise((res) => {
        const t = db.transaction(STORE, 'readwrite');
        t.objectStore(STORE).clear();
        t.oncomplete = () => res();
        t.onerror = () => res();
      });
    }
  } catch { /* ignore */ }
  for (const ns of KNOWN_NS) {
    for (const k of LEGACY_KEYS(ns)) {
      try { localStorage.removeItem(k); } catch { /* ignore */ }
    }
  }
}
