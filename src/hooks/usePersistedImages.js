import { useState, useEffect } from 'react';
import { idbGet, idbSet, migrateNamespace } from '@/lib/imageStore';

// Per-browser image store, backed by an app-isolated IndexedDB database (see
// imageStore.js). Large quota + isolation from other apps on the same origin.
// saveImage/deleteImage are async and return a boolean success so the uploader
// can show an error instead of silently failing.

export default function usePersistedImages(namespace) {
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    let alive = true;
    (async () => {
      await migrateNamespace(namespace);           // move old localStorage data in, once
      const data = await idbGet(namespace);
      if (alive && data && typeof data === 'object') setImageUrls(data);
    })();
    return () => { alive = false; };
  }, [namespace]);

  const saveImage = async (key, url) => {
    const next = { ...imageUrls, [key]: url };
    try {
      await idbSet(namespace, next);
      setImageUrls(next);
      return true;
    } catch {
      return false;
    }
  };

  const deleteImage = async (key) => {
    const next = { ...imageUrls, [key]: '' };
    try { await idbSet(namespace, next); } catch { /* ignore */ }
    setImageUrls(next);
    return true;
  };

  return { imageUrls, saveImage, deleteImage };
}
