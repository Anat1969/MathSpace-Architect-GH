import { useState, useEffect, useRef, useCallback } from 'react';
import { idbGet, idbPut, migrateNamespace } from '@/lib/imageStore';

// Per-browser image store, backed by an app-isolated IndexedDB database with one
// record PER IMAGE (see imageStore.js). A `ref` mirrors the current map so the UI
// updates immediately and never reads a stale closure; the async initial load
// merges UNDER whatever is already in memory. Because each save writes only its
// own IndexedDB record, an upload can never clobber another image — this is what
// makes every upload reliably persist. save/delete are async and return a bool.

export default function usePersistedImages(namespace) {
  const [imageUrls, setImageUrls] = useState({});
  const ref = useRef({});

  const commit = useCallback((next) => {
    ref.current = next;
    setImageUrls(next);
  }, []);

  useEffect(() => {
    let alive = true;
    ref.current = {};
    setImageUrls({});
    (async () => {
      await migrateNamespace(namespace);
      const data = await idbGet(namespace);
      if (!alive) return;
      if (data && typeof data === 'object') commit({ ...data, ...ref.current });
    })();
    return () => { alive = false; };
  }, [namespace, commit]);

  const saveImage = useCallback(async (key, url) => {
    commit({ ...ref.current, [key]: url }); // show immediately
    try {
      await idbPut(namespace, key, url);     // writes only this image's record
      return true;
    } catch {
      return false;
    }
  }, [namespace, commit]);

  const deleteImage = useCallback(async (key) => {
    commit({ ...ref.current, [key]: '' });
    try { await idbPut(namespace, key, ''); } catch { /* ignore */ }
    return true;
  }, [namespace, commit]);

  return { imageUrls, saveImage, deleteImage };
}
