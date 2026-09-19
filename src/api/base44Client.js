// ─────────────────────────────────────────────────────────────────────────────
// Static data client — the local replacement for the Base44 SDK.
//
// The app used to read its content from the Base44 backend. It now ships as a
// fully static site (GitHub Pages) with all content bundled as JSON under
// src/data. This shim exposes the same tiny surface the app used
// (`base44.entities.X.list()`, a few CRUD calls for the Admin page,
// `base44.auth.*`, and `base44.integrations.Core.UploadFile`) so the rest of the
// code did not have to change.
//
// • Reads come from the bundled JSON — the canonical content lives in the repo.
// • Admin edits are kept in a per-browser localStorage overlay (no server), so
//   the Admin page still works as a local preview editor. The source of truth
//   stays the JSON files in GitHub.
// • Uploads become local data URLs (no server storage).
// • Auth is a no-op: the app is public, there is no login.
// ─────────────────────────────────────────────────────────────────────────────

import RoomGeometry from '@/data/RoomGeometry.json';
import FractalUrbanModel from '@/data/FractalUrbanModel.json';
import CalculusPhysicsModel from '@/data/CalculusPhysicsModel.json';
import ArchitecturalModel from '@/data/ArchitecturalModel.json';
import ARTopologyModel from '@/data/ARTopologyModel.json';

const SEED = {
  RoomGeometry,
  FractalUrbanModel,
  CalculusPhysicsModel,
  ArchitecturalModel,
  ARTopologyModel,
};

const overlayKey = (name) => `ms_entity_${name}`;

const readData = (name) => {
  try {
    const raw = localStorage.getItem(overlayKey(name));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* fall through to seed */ }
  // Return a shallow clone so callers can't mutate the imported module.
  return (SEED[name] || []).map((r) => ({ ...r }));
};

const writeData = (name, rows) => {
  try {
    localStorage.setItem(overlayKey(name), JSON.stringify(rows));
  } catch { /* storage unavailable — keep working in-memory */ }
};

const genId = () =>
  `local_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const makeEntity = (name) => ({
  // Base44 returned every row; the app builds its own id→record maps and takes
  // the last write, so preserving the original order keeps behaviour identical.
  list: async () => readData(name),
  filter: async (query = {}) => {
    const rows = readData(name);
    const entries = Object.entries(query);
    if (entries.length === 0) return rows;
    return rows.filter((r) => entries.every(([k, v]) => r[k] === v));
  },
  create: async (record) => {
    const rows = readData(name);
    const created = {
      ...record,
      id: record.id || genId(),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    };
    rows.push(created);
    writeData(name, rows);
    return created;
  },
  update: async (id, patch) => {
    const rows = readData(name);
    const idx = rows.findIndex((r) => r.id === id);
    if (idx !== -1) {
      rows[idx] = { ...rows[idx], ...patch, updated_date: new Date().toISOString() };
      writeData(name, rows);
      return rows[idx];
    }
    return null;
  },
  delete: async (id) => {
    const rows = readData(name).filter((r) => r.id !== id);
    writeData(name, rows);
    return { id };
  },
  // Restore this entity to the content shipped in the repo.
  reset: async () => {
    try { localStorage.removeItem(overlayKey(name)); } catch { /* ignore */ }
    return readData(name);
  },
});

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const base44 = {
  entities: Object.keys(SEED).reduce((acc, name) => {
    acc[name] = makeEntity(name);
    return acc;
  }, {}),

  // No backend, no login. `me()` rejects so any `.then/.catch` auth check
  // resolves to "not signed in", which is the public state the app now uses.
  auth: {
    me: async () => { throw new Error('Auth is disabled in the static build'); },
    logout: () => {},
    redirectToLogin: () => {},
    isAuthenticated: () => false,
  },

  integrations: {
    Core: {
      // Keep uploaded images entirely client-side as data URLs.
      UploadFile: async ({ file }) => ({ file_url: await fileToDataUrl(file) }),
    },
  },
};
