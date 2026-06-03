/**
 * GameState Model
 * Tracks the current state of the game session.
 */
export const GameStatus = Object.freeze({
  IDLE: 'idle',
  PLAYING: 'playing',
  WIN: 'win',
  DRAW: 'draw',
});

export class GameState {
  constructor() {
    this.status = GameStatus.IDLE;
    this.currentPlayerIndex = 0;
    this.winnerMark = null;
    this.winPattern = null;
    this.draws = 0;
  }

  reset() {
    this.status = GameStatus.PLAYING;
    this.currentPlayerIndex = 0;
    this.winnerMark = null;
    this.winPattern = null;
  }

  setWin(mark, pattern) {
    this.status = GameStatus.WIN;
    this.winnerMark = mark;
    this.winPattern = pattern;
  }

  setDraw() {
    this.status = GameStatus.DRAW;
    this.draws++;
  }

  switchPlayer() {
    this.currentPlayerIndex = this.currentPlayerIndex === 0 ? 1 : 0;
  }
}
