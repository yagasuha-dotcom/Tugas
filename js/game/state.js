import { MAX_HEARTS, SAVE_KEY } from './constants.js';

export function newState(name = 'Sasi', look = 0) {
  return {
    v: 1, player: { name, look }, hearts: MAX_HEARTS, poin: 0,
    flags: {}, cards: [], shards: [], stats: { benar: 0, salah: 0 },
    pos: { map: 'desa', x: 3, y: 10 },
  };
}
export function hasSave() { try { return !!localStorage.getItem(SAVE_KEY); } catch { return false; } }
export function saveState(s) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); return true; } catch { return false; } }
export function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    return s && s.v === 1 ? { ...newState(), ...s } : null;
  } catch { return null; }
}
export function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch { /* abaikan */ } }
