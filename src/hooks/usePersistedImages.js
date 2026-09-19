import { useState } from 'react';

// Per-browser image store.
//
// IMPORTANT: every GitHub Pages project of this account is served from the same
// origin (anat1969.github.io, different sub-folders), and localStorage is scoped
// per ORIGIN — so all of those apps share one storage bucket. To make absolutely
// sure this app only ever touches ITS OWN data (and never another app's), every
// key is namespaced with a prefix unique to this app. Reads, writes, and the
// quota-recovery eviction below all stay within that prefix.
//
// Images are downscaled data URLs. Writes are guarded (localStorage can throw on
// quota/private mode); an unguarded throw would crash React and blank the page.
// saveImage returns true on success, false if it genuinely could not persist.

const APP = 'msa';                       // unique to MathSpace Architect
const PREFIX = `${APP}:images:`;         // e.g. "msa:images:module1"
const LEGACY = 'images_';                // keys this app used before prefixing
const KNOWN_NS = ['module1', 'module2', 'module3', 'module4', 'module5'];

const appKey = (ns) => `${PREFIX}${ns}`;
const legacyKey = (ns) => `${LEGACY}${ns}`;

const tryGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const trySet = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };
const tryRemove = (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } };

// Move this app's own pre-prefix key into the app-scoped namespace, once.
const migrateLegacy = (ns) => {
  const legacy = tryGet(legacyKey(ns));
  if (legacy == null) return null;
  if (tryGet(appKey(ns)) == null) trySet(appKey(ns), legacy);
  tryRemove(legacyKey(ns));
  return legacy;
};

// Free space by removing ONLY this app's own image data: its app-scoped keys and
// its own known legacy module keys. Never removes a key that could belong to
// another app on the shared origin.
const evictOwnImages = (keepNs) => {
  let freed = false;
  try {
    const remove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX) && k !== appKey(keepNs)) remove.push(k);
    }
    for (const ns of KNOWN_NS) if (ns !== keepNs) remove.push(legacyKey(ns));
    remove.forEach((k) => { if (tryGet(k) != null) { tryRemove(k); freed = true; } });
  } catch { /* ignore */ }
  return freed;
};

export default function usePersistedImages(namespace) {
  const load = () => {
    try {
      let raw = tryGet(appKey(namespace));
      if (raw == null) raw = migrateLegacy(namespace);
      return JSON.parse(raw || '{}');
    } catch { return {}; }
  };

  const [imageUrls, setImageUrls] = useState(load);

  const saveImage = (key, url) => {
    const next = { ...imageUrls, [key]: url };
    const payload = JSON.stringify(next);

    // 1) Normal write.
    if (trySet(appKey(namespace), payload)) { setImageUrls(next); return true; }

    // 2) Quota hit — evict THIS app's other images and retry.
    if (evictOwnImages(namespace) && trySet(appKey(namespace), payload)) {
      setImageUrls(next); return true;
    }

    // 3) Still full — keep only the image just uploaded.
    const minimal = { [key]: url };
    if (trySet(appKey(namespace), JSON.stringify(minimal))) { setImageUrls(minimal); return true; }

    return false;
  };

  const deleteImage = (key) => {
    const next = { ...imageUrls, [key]: '' };
    trySet(appKey(namespace), JSON.stringify(next));
    setImageUrls(next);
    return true;
  };

  return { imageUrls, saveImage, deleteImage };
}
