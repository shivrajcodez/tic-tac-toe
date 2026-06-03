/**
 * AIService
 * Provides computer move logic for three difficulty levels.
 *
 * Easy   — random moves
 * Medium — 60% strategic, 40% random
 * Hard   — unbeatable Minimax algorithm
 */
export class AIService {
  static Difficulty = Object.freeze({
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
  });

  /**
   * Returns the best cell index for the computer to play.
   * @param {Board} board
   * @param {'X'|'O'} computerMark
   * @param {string} difficulty
   * @returns {number}
   */
  static getBestMove(board, computerMark, difficulty) {
    switch (difficulty) {
      case AIService.Difficulty.EASY:
        return AIService._randomMove(board);
      case AIService.Difficulty.MEDIUM:
        return AIService._mediumMove(board, computerMark);
      case AIService.Difficulty.HARD:
        return AIService._minimaxMove(board, computerMark);
      default:
        return AIService._randomMove(board);
    }
  }

  // ─── Easy ─────────────────────────────────────────────────────────────────

  static _randomMove(board) {
    const moves = board.getAvailableMoves();
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // ─── Medium ───────────────────────────────────────────────────────────────

  static _mediumMove(board, computerMark) {
    // 60% chance to play smart
    if (Math.random() < 0.6) {
      const opponentMark = computerMark === 'X' ? 'O' : 'X';

      // Win if possible
      const winMove = AIService._findWinningMove(board, computerMark);
      if (winMove !== -1) return winMove;

      // Block opponent from winning
      const blockMove = AIService._findWinningMove(board, opponentMark);
      if (blockMove !== -1) return blockMove;

      // Take center
      if (board.cells[4] === null) return 4;
    }

    return AIService._randomMove(board);
  }

  static _findWinningMove(board, mark) {
    for (const index of board.getAvailableMoves()) {
      const clone = board.clone();
      clone.place(index, mark);
      if (clone.checkWinner(mark)) return index;
    }
    return -1;
  }

  // ─── Hard (Minimax) ───────────────────────────────────────────────────────

  static _minimaxMove(board, computerMark) {
    const opponentMark = computerMark === 'X' ? 'O' : 'X';
    let bestScore = -Infinity;
    let bestMove = -1;

    for (const index of board.getAvailableMoves()) {
      const clone = board.clone();
      clone.place(index, computerMark);
      const score = AIService._minimax(clone, 0, false, computerMark, opponentMark, -Infinity, Infinity);
      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    }

    return bestMove;
  }

  /**
   * Minimax with alpha-beta pruning.
   * @returns {number} score
   */
  static _minimax(board, depth, isMaximizing, computerMark, opponentMark, alpha, beta) {
    if (board.checkWinner(computerMark)) return 10 - depth;
    if (board.checkWinner(opponentMark)) return depth - 10;
    if (board.isDraw()) return 0;

    const moves = board.getAvailableMoves();

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const index of moves) {
        const clone = board.clone();
        clone.place(index, computerMark);
        const score = AIService._minimax(clone, depth + 1, false, computerMark, opponentMark, alpha, beta);
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // prune
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const index of moves) {
        const clone = board.clone();
        clone.place(index, opponentMark);
        const score = AIService._minimax(clone, depth + 1, true, computerMark, opponentMark, alpha, beta);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // prune
      }
      return minScore;
    }
  }
}
