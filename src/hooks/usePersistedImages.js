import { useState } from 'react';

// Per-browser image store. Images are kept as (already downscaled) data URLs in
// localStorage. Every write is guarded: localStorage can throw (quota exceeded,
// private mode), and an unguarded throw here would crash the React tree and blank
// the screen. saveImage returns true on success and false when it could not be
// persisted, so the UI can show an error instead of a blank page.

export default function usePersistedImages(namespace) {
  const storageKey = `images_${namespace}`;

  const load = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); }
    catch { return {}; }
  };

  const [imageUrls, setImageUrls] = useState(load);

  const saveImage = (key, url) => {
    const next = { ...imageUrls, [key]: url };
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      return false; // quota / storage unavailable — caller shows an error
    }
    setImageUrls(next);
    return true;
  };

  const deleteImage = (key) => {
    const next = { ...imageUrls, [key]: '' };
    try { localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { /* ignore — still clear it in memory below */ }
    setImageUrls(next);
    return true;
  };

  return { imageUrls, saveImage, deleteImage };
}
