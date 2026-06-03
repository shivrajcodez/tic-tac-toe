/**
 * Player Model
 * Represents a player (human or computer).
 */
export class Player {
  /**
   * @param {string} name
   * @param {'X'|'O'} mark
   * @param {'human'|'computer'} type
   */
  constructor(name, mark, type = 'human') {
    this.name = name;
    this.mark = mark;
    this.type = type;
    this.score = 0;
  }

  incrementScore() {
    this.score++;
  }

  resetScore() {
    this.score = 0;
  }
}
