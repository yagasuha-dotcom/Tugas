import { Game } from './game/game.js';

const game = new Game();
game.run();
window.__game = game; // memudahkan debugging lewat konsol
