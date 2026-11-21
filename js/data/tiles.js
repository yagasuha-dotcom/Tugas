// Definisi tile. solid = tidak bisa dilewati, anim = jumlah frame animasi.
export const TILES = {
  grass: {}, flower: {}, path: {}, sand: {}, plank: {}, stonefloor: {}, carpet: {},
  cave: {}, nether: {}, bridge: {}, door: {}, ladder: {},
  water: { solid: true, anim: 2 }, lava: { solid: true, anim: 2 },
  tree: { solid: true }, bush: { solid: true }, fence: { solid: true },
  woodwall: { solid: true }, roof: { solid: true }, roofblue: { solid: true }, brick: { solid: true },
  stone: { solid: true }, ore_coal: { solid: true }, ore_gold: { solid: true }, ore_dia: { solid: true },
  torchwall: { solid: true, anim: 2 },
  stall_red: { solid: true }, stall_blue: { solid: true }, stall_green: { solid: true },
  crate: { solid: true }, gold: { solid: true }, obsidian: { solid: true },
};
export const isSolidTile = (k) => !!(TILES[k] && TILES[k].solid);
