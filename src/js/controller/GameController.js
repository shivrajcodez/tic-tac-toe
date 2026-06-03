/**
 * GameController
 * Orchestrates game flow: setup, turns, win/draw detection, scoring.
 * Bridges model and UI — no direct DOM manipulation here.
 */
import { Board } from '../model/Board.js';
import { Player } from '../model/Player.js';
import { GameState, GameStatus } from '../model/GameState.js';
import { AIService } from '../service/AIService.js';

export class GameController {
  /**
   * @param {object} config
   * @param {'pvp'|'pvc'} config.mode
   * @param {string} config.difficulty
   * @param {string} config.player1Name
   * @param {string} config.player2Name
   * @param {Function} config.onStateChange - called after every state change
   */
  constructor(config) {
    this.config = config;
    this.board = new Board();
    this.state = new GameState();

    const p2IsComputer = config.mode === 'pvc';
    this.players = [
      new Player(config.player1Name || 'Player 1', 'X', 'human'),
      new Player(
        p2IsComputer ? 'Computer' : (config.player2Name || 'Player 2'),
        'O',
        p2IsComputer ? 'computer' : 'human'
      ),
    ];

    this.onStateChange = config.onStateChange || (() => {});
    this.state.reset();
    this._notifyChange();
  }

  get currentPlayer() {
    return this.players[this.state.currentPlayerIndex];
  }

  get isComputerTurn() {
    return this.currentPlayer.type === 'computer';
  }

  /**
   * Human clicks a cell.
   * @param {number} index
   * @returns {boolean} Whether the move was accepted
   */
  handleCellClick(index) {
    if (this.state.status !== GameStatus.PLAYING) return false;
    if (this.isComputerTurn) return false;
    return this._makeMove(index);
  }

  /**
   * Trigger computer move (call after a delay for UX).
   */
  triggerComputerMove() {
    if (this.state.status !== GameStatus.PLAYING) return;
    if (!this.isComputerTurn) return;

    const move = AIService.getBestMove(
      this.board,
      this.currentPlayer.mark,
      this.config.difficulty || AIService.Difficulty.HARD
    );

    if (move !== undefined && move !== -1) {
      this._makeMove(move);
    }
  }

  _makeMove(index) {
    if (!this.board.place(index, this.currentPlayer.mark)) return false;

    const winResult = this.board.checkWinner(this.currentPlayer.mark);
    if (winResult) {
      this.state.setWin(winResult.winner, winResult.pattern);
      this.currentPlayer.incrementScore();
    } else if (this.board.isDraw()) {
      this.state.setDraw();
    } else {
      this.state.switchPlayer();
    }

    this._notifyChange();
    return true;
  }

  /**
   * Restart the current match (keep scores).
   */
  restartGame() {
    this.board.reset();
    this.state.reset();
    this._notifyChange();
  }

  /**
   * Start a brand new match (reset scores).
   */
  newMatch() {
    this.board.reset();
    this.state.reset();
    this.state.draws = 0;
    this.players.forEach(p => p.resetScore());
    this._notifyChange();
  }

  getSnapshot() {
    return {
      cells: [...this.board.cells],
      status: this.state.status,
      currentPlayer: this.currentPlayer,
      players: this.players,
      winPattern: this.state.winPattern,
      winnerMark: this.state.winnerMark,
      draws: this.state.draws,
      isComputerTurn: this.isComputerTurn,
    };
  }

  _notifyChange() {
    this.onStateChange(this.getSnapshot());
  }
}
