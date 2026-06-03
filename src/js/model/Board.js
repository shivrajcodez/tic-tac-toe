/**
 * Board Model
 * Represents the Tic Tac Toe game board state.
 * Pure data model — no UI logic.
 */
export class Board {
  static SIZE = 3;

  static WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],             // diagonals
  ];

  constructor() {
    this.reset();
  }

  reset() {
    this.cells = Array(9).fill(null);
  }

  /**
   * Place a mark on the board.
   * @param {number} index - Cell index (0–8)
   * @param {string} mark - 'X' or 'O'
   * @returns {boolean} Whether the move was valid
   */
  place(index, mark) {
    if (this.cells[index] !== null) return false;
    this.cells[index] = mark;
    return true;
  }

  /**
   * @param {string} mark
   * @returns {{ winner: string, pattern: number[] } | null}
   */
  checkWinner(mark) {
    for (const pattern of Board.WIN_PATTERNS) {
      if (pattern.every(i => this.cells[i] === mark)) {
        return { winner: mark, pattern };
      }
    }
    return null;
  }

  isDraw() {
    return this.cells.every(cell => cell !== null) && !this.checkWinner('X') && !this.checkWinner('O');
  }

  getAvailableMoves() {
    return this.cells.reduce((moves, cell, i) => {
      if (cell === null) moves.push(i);
      return moves;
    }, []);
  }

  clone() {
    const newBoard = new Board();
    newBoard.cells = [...this.cells];
    return newBoard;
  }
}
