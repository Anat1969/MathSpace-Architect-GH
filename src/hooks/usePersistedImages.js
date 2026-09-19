import { useState } from 'react';

// Per-browser image store. Images are kept as (already downscaled) data URLs in
// localStorage. Every write is guarded: localStorage can throw (quota exceeded,
// private mode), and an unguarded throw here would crash the React tree and blank
// the screen. saveImage returns true on success and false when it could not be
// persisted, so the UI can show an error instead of a blank page.
//
// Storage can fill up from images saved before aggressive compression existed.
// To keep new (tiny) uploads from being blocked by that old bloat, a quota
// failure triggers progressive eviction: first drop image data from OTHER
// modules, then, if still stuck, keep only the image just uploaded.

const NS_PREFIX = 'images_';

const trySet = (k, v) => {
  try { localStorage.setItem(k, v); return true; }
  catch { return false; }
};

// Remove every images_* namespace except the one being written to.
const evictOtherImageNamespaces = (keepKey) => {
  try {
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(NS_PREFIX) && k !== keepKey) toRemove.push(k);
    }
    toRemove.forEach(k => localStorage.removeItem(k));
    return toRemove.length > 0;
  } catch { return false; }
};

export default function usePersistedImages(namespace) {
  const storageKey = `${NS_PREFIX}${namespace}`;

  const load = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); }
    catch { return {}; }
  };

  const [imageUrls, setImageUrls] = useState(load);

  const saveImage = (key, url) => {
    const next = { ...imageUrls, [key]: url };
    const payload = JSON.stringify(next);

    // 1) Normal write.
    if (trySet(storageKey, payload)) { setImageUrls(next); return true; }

    // 2) Quota hit — clear old images from other modules and retry.
    if (evictOtherImageNamespaces(storageKey) && trySet(storageKey, payload)) {
      setImageUrls(next); return true;
    }

    // 3) Still full — keep only the image just uploaded, drop this module's rest.
    const minimal = { [key]: url };
    if (trySet(storageKey, JSON.stringify(minimal))) { setImageUrls(minimal); return true; }

    return false; // genuinely could not save (e.g. storage disabled)
  };

  const deleteImage = (key) => {
    const next = { ...imageUrls, [key]: '' };
    trySet(storageKey, JSON.stringify(next));
    setImageUrls(next);
    return true;
  };

  return { imageUrls, saveImage, deleteImage };
}
