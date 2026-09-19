import { useState } from 'react';

export default function usePersistedImages(namespace) {
  const storageKey = `images_${namespace}`;

  const load = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); } 
    catch { return {}; }
  };

  const [imageUrls, setImageUrls] = useState(load);

  const saveImage = (key, url) => {
    setImageUrls(prev => {
      const next = { ...prev, [key]: url };
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const deleteImage = (key) => {
    setImageUrls(prev => {
      const next = { ...prev, [key]: '' };
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  return { imageUrls, saveImage, deleteImage };
}