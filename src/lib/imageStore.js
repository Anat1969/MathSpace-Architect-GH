// App-isolated image storage backed by IndexedDB, one record PER IMAGE.
//
// Why per-image records: storing a whole per-module object and rewriting it is
// prone to a race — an upload that fires before the initial async load finishes
// would overwrite the whole object and drop other images. Keying every image
// separately (`${namespace}::${imageKey}`) means a save only ever writes its own
// record and can never clobber another image, so nothing is silently lost.
//
// Isolation + capacity: every GitHub Pages app of this account shares one origin
// (anat1969.github.io) and thus one localStorage; IndexedDB databases are keyed
// by NAME, so a DB named for this app is fully isolated from other apps and has a
// far larger quota. That fixes both "some images don't save" and "storage full".

const DB_NAME = 'msa-images';       // unique to MathSpace Architect
const STORE = 'namespaces';         // (kept name) now holds one record per image
const KNOWN_NS = ['module1', 'module2', 'module3', 'module4', 'module5'];
const legacyLsKeys = (ns) => [`msa:images:${ns}`, `images_${ns}`];

const hasIDB = () => typeof indexedDB !== 'undefined';
const sep = '::';
const recKey = (ns, imgKey) => `${ns}${sep}${imgKey}`;
const nsRange = (ns) => IDBKeyRange.bound(`${ns}${sep}`, `${ns}${sep}￿`);
const reqP = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });

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

// Read every image for a namespace: the per-image records plus any legacy
// whole-object record still stored under the bare namespace key.
export async function idbGet(ns) {
  if (!hasIDB()) return {};
  try {
    const db = await openDB();
    const s = db.transaction(STORE, 'readonly').objectStore(STORE);
    // Issue all requests synchronously so the transaction stays active.
    const keysReq = s.getAllKeys(nsRange(ns));
    const valsReq = s.getAll(nsRange(ns));
    const legacyReq = s.get(ns);
    const [keys, vals, legacy] = await Promise.all([reqP(keysReq), reqP(valsReq), reqP(legacyReq)]);
    const out = {};
    if (legacy && typeof legacy === 'object') {
      for (const [k, v] of Object.entries(legacy)) if (v) out[k] = v;
    }
    keys.forEach((k, i) => { out[String(k).slice(ns.length + sep.length)] = vals[i]; });
    return out;
  } catch { return {}; }
}

// Save one image. Never touches any other image's record.
export async function idbPut(ns, imgKey, url) {
  if (!hasIDB()) throw new Error('IndexedDB unavailable');
  const db = await openDB();
  await new Promise((res, rej) => {
    const t = db.transaction(STORE, 'readwrite');
    if (url) t.objectStore(STORE).put(url, recKey(ns, imgKey));
    else t.objectStore(STORE).delete(recKey(ns, imgKey));
    t.oncomplete = () => res();
    t.onerror = () => rej(t.error);
    t.onabort = () => rej(t.error);
  });
}

export async function idbDelete(ns, imgKey) {
  try { await idbPut(ns, imgKey, ''); } catch { /* ignore */ }
}

// One-time: move this app's legacy data (old localStorage whole-objects and the
// old bare-namespace IDB object) into per-image records, then remove the old
// copies. Only touches THIS app's own keys.
export async function migrateNamespace(ns) {
  if (!hasIDB()) return;
  try {
    // localStorage whole-objects
    for (const k of legacyLsKeys(ns)) {
      let raw = null;
      try { raw = localStorage.getItem(k); } catch { /* ignore */ }
      if (raw) {
        try {
          const obj = JSON.parse(raw);
          if (obj && typeof obj === 'object') {
            for (const [imgKey, url] of Object.entries(obj)) if (url) await idbPut(ns, imgKey, url);
          }
        } catch { /* ignore */ }
      }
      try { localStorage.removeItem(k); } catch { /* ignore */ }
    }
    // legacy bare-namespace IDB object → per-image records, then remove it
    const db = await openDB();
    const legacy = await reqP(db.transaction(STORE, 'readonly').objectStore(STORE).get(ns));
    if (legacy && typeof legacy === 'object') {
      for (const [imgKey, url] of Object.entries(legacy)) if (url) await idbPut(ns, imgKey, url);
      await new Promise((res) => {
        const t = db.transaction(STORE, 'readwrite');
        t.objectStore(STORE).delete(ns);
        t.oncomplete = () => res(); t.onerror = () => res();
      });
    }
  } catch { /* ignore */ }
}

// Remove ALL of this app's stored images (its IndexedDB store + leftover
// localStorage keys). Never touches another app's data.
export async function clearAppImages() {
  try {
    if (hasIDB()) {
      const db = await openDB();
      await new Promise((res) => {
        const t = db.transaction(STORE, 'readwrite');
        t.objectStore(STORE).clear();
        t.oncomplete = () => res(); t.onerror = () => res();
      });
    }
  } catch { /* ignore */ }
  for (const ns of KNOWN_NS) for (const k of legacyLsKeys(ns)) {
    try { localStorage.removeItem(k); } catch { /* ignore */ }
  }
}
