/**
 * UIRenderer
 * Handles all DOM manipulation and animations.
 * Receives snapshots from GameController and updates the view.
 */
import { GameStatus } from '../model/GameState.js';

export class UIRenderer {
  constructor(soundService) {
    this.sound = soundService;
    this._prevSnapshot = null;
    this._bindElements();
  }

  _bindElements() {
    this.boardEl = document.getElementById('board');
    this.statusEl = document.getElementById('status-text');
    this.statusBadgeEl = document.getElementById('status-badge');
    this.p1NameEl = document.getElementById('p1-name');
    this.p2NameEl = document.getElementById('p2-name');
    this.p1ScoreEl = document.getElementById('p1-score');
    this.p2ScoreEl = document.getElementById('p2-score');
    this.drawsEl = document.getElementById('draws-score');
    this.p1CardEl = document.getElementById('p1-card');
    this.p2CardEl = document.getElementById('p2-card');
    this.resultOverlayEl = document.getElementById('result-overlay');
    this.resultTitleEl = document.getElementById('result-title');
    this.resultSubtitleEl = document.getElementById('result-subtitle');
    this.resultEmojiEl = document.getElementById('result-emoji');
    this.thinkingIndicatorEl = document.getElementById('thinking-indicator');
  }

  /**
   * Full render from a game snapshot.
   */
  render(snapshot, onCellClick) {
    const prev = this._prevSnapshot;
    this._renderBoard(snapshot, prev, onCellClick);
    this._renderScoreboard(snapshot);
    this._renderStatus(snapshot);
    this._renderTurnCards(snapshot);
    this._renderThinking(snapshot);

    if (snapshot.status === GameStatus.WIN || snapshot.status === GameStatus.DRAW) {
      this._showResultOverlay(snapshot);
    } else {
      this._hideResultOverlay();
    }

    this._prevSnapshot = snapshot;
  }

  _renderBoard(snapshot, prev, onCellClick) {
    this.boardEl.innerHTML = '';

    snapshot.cells.forEach((cell, index) => {
      const cellEl = document.createElement('button');
      cellEl.className = 'cell';
      cellEl.setAttribute('aria-label', `Cell ${index + 1}`);

      if (cell) {
        cellEl.classList.add('filled', `mark-${cell.toLowerCase()}`);
        cellEl.textContent = cell;

        // Animate newly placed mark
        const wasEmpty = !prev || prev.cells[index] === null;
        if (wasEmpty) {
          cellEl.classList.add('pop-in');
        }
      }

      if (snapshot.winPattern && snapshot.winPattern.includes(index)) {
        cellEl.classList.add('winner-cell');
      }

      const isClickable =
        !cell &&
        snapshot.status === GameStatus.PLAYING &&
        !snapshot.isComputerTurn;

      if (isClickable) {
        cellEl.classList.add('hoverable');
        cellEl.dataset.mark = snapshot.currentPlayer.mark;
        cellEl.addEventListener('click', () => {
          this.sound.playMove();
          onCellClick(index);
        });
        cellEl.addEventListener('mouseenter', () => {
          this.sound.playHover();
        });
      } else {
        cellEl.disabled = true;
      }

      this.boardEl.appendChild(cellEl);
    });
  }

  _renderScoreboard(snapshot) {
    const [p1, p2] = snapshot.players;
    this.p1NameEl.textContent = p1.name;
    this.p2NameEl.textContent = p2.name;
    this.p1ScoreEl.textContent = p1.score;
    this.p2ScoreEl.textContent = p2.score;
    this.drawsEl.textContent = snapshot.draws;
  }

  _renderTurnCards(snapshot) {
    const isP1Turn = snapshot.currentPlayer.mark === 'X' && snapshot.status === GameStatus.PLAYING;
    const isP2Turn = snapshot.currentPlayer.mark === 'O' && snapshot.status === GameStatus.PLAYING;

    this.p1CardEl.classList.toggle('active-turn', isP1Turn);
    this.p2CardEl.classList.toggle('active-turn', isP2Turn);
  }

  _renderStatus(snapshot) {
    let text = '';
    let badge = '';

    switch (snapshot.status) {
      case GameStatus.PLAYING:
        text = snapshot.isComputerTurn
          ? 'Computer is thinking…'
          : `${snapshot.currentPlayer.name}'s turn`;
        badge = snapshot.currentPlayer.mark;
        break;
      case GameStatus.WIN:
        text = `${snapshot.players.find(p => p.mark === snapshot.winnerMark).name} wins!`;
        badge = '🏆';
        break;
      case GameStatus.DRAW:
        text = "It's a draw!";
        badge = '🤝';
        break;
    }

    if (this.statusEl.textContent !== text) {
      this.statusEl.classList.add('fade-update');
      this.statusEl.textContent = text;
      this.statusBadgeEl.textContent = badge;
      setTimeout(() => this.statusEl.classList.remove('fade-update'), 300);
    }
  }

  _renderThinking(snapshot) {
    const show = snapshot.isComputerTurn && snapshot.status === GameStatus.PLAYING;
    this.thinkingIndicatorEl.classList.toggle('visible', show);
  }

  _showResultOverlay(snapshot) {
    if (this.resultOverlayEl.classList.contains('visible')) return;

    if (snapshot.status === GameStatus.WIN) {
      const winner = snapshot.players.find(p => p.mark === snapshot.winnerMark);
      this.resultEmojiEl.textContent = winner.type === 'computer' ? '🤖' : '🏆';
      this.resultTitleEl.textContent = `${winner.name} Wins!`;
      this.resultSubtitleEl.textContent = 'Congratulations!';
      this.sound.playWin();
    } else {
      this.resultEmojiEl.textContent = '🤝';
      this.resultTitleEl.textContent = "It's a Draw!";
      this.resultSubtitleEl.textContent = 'Well played by both!';
      this.sound.playDraw();
    }

    this.resultOverlayEl.classList.add('visible');
  }

  _hideResultOverlay() {
    this.resultOverlayEl.classList.remove('visible');
  }

  /**
   * Show the setup screen, hide game screen.
   */
  showSetup() {
    document.getElementById('setup-screen').classList.remove('hidden');
    document.getElementById('game-screen').classList.add('hidden');
  }

  /**
   * Show the game screen, hide setup.
   */
  showGame() {
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
  }
}
