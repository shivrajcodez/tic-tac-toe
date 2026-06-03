/**
 * App.js — Entry point
 * Wires together GameController, UIRenderer, and SoundService.
 */
import { GameController } from './controller/GameController.js';
import { UIRenderer } from './controller/UIRenderer.js';
import { SoundService } from './service/SoundService.js';
import { AppConfig } from './config/AppConfig.js';
import { GameStatus } from './model/GameState.js';

class App {
  constructor() {
    this.sound = new SoundService();
    this.ui = new UIRenderer(this.sound);
    this.game = null;
    this._computerMoveTimer = null;

    this._bindSetupEvents();
    this._bindSoundToggle();
    this.ui.showSetup();
  }

  _bindSetupEvents() {
    // Mode toggle
    document.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mode;
        document.getElementById('difficulty-section').classList.toggle('hidden', mode !== 'pvc');
        document.getElementById('p2-name-section').classList.toggle('hidden', mode === 'pvc');
        this.sound.playClick();
      });
    });

    // Difficulty toggle
    document.querySelectorAll('[data-difficulty]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-difficulty]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.sound.playClick();
      });
    });

    // Start game
    document.getElementById('start-btn').addEventListener('click', () => {
      this.sound.playClick();
      this._startGame();
    });

    // Restart
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.sound.playClick();
      this._restartGame();
    });

    // New match
    document.getElementById('new-match-btn').addEventListener('click', () => {
      this.sound.playClick();
      this._newMatch();
    });

    // Back to menu
    document.getElementById('back-btn').addEventListener('click', () => {
      this.sound.playClick();
      this.ui.showSetup();
    });

    // Overlay buttons
    document.getElementById('overlay-restart-btn').addEventListener('click', () => {
      this.sound.playClick();
      this._restartGame();
    });
    document.getElementById('overlay-newmatch-btn').addEventListener('click', () => {
      this.sound.playClick();
      this._newMatch();
    });
  }

  _bindSoundToggle() {
    const btn = document.getElementById('sound-toggle');
    let muted = false;
    btn.addEventListener('click', () => {
      muted = !muted;
      this.sound.setEnabled(!muted);
      btn.textContent = muted ? '🔇' : '🔊';
      btn.title = muted ? 'Unmute sounds' : 'Mute sounds';
    });
  }

  _startGame() {
    const mode = document.querySelector('[data-mode].active')?.dataset.mode || AppConfig.DEFAULT_MODE;
    const difficulty = document.querySelector('[data-difficulty].active')?.dataset.difficulty || AppConfig.DEFAULT_DIFFICULTY;
    const p1Name = document.getElementById('p1-name-input').value.trim() || 'Player 1';
    const p2Name = document.getElementById('p2-name-input').value.trim() || 'Player 2';

    this.game = new GameController({
      mode,
      difficulty,
      player1Name: p1Name,
      player2Name: p2Name,
      onStateChange: (snapshot) => this._onStateChange(snapshot),
    });

    this.ui.showGame();
  }

  _restartGame() {
    clearTimeout(this._computerMoveTimer);
    this.game.restartGame();
  }

  _newMatch() {
    clearTimeout(this._computerMoveTimer);
    this.game.newMatch();
  }

  _onStateChange(snapshot) {
    this.ui.render(snapshot, (index) => this._handleCellClick(index));

    // Trigger computer move after a short delay
    if (snapshot.isComputerTurn && snapshot.status === GameStatus.PLAYING) {
      clearTimeout(this._computerMoveTimer);
      this._computerMoveTimer = setTimeout(() => {
        this.game.triggerComputerMove();
      }, AppConfig.COMPUTER_MOVE_DELAY_MS);
    }
  }

  _handleCellClick(index) {
    this.game.handleCellClick(index);
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
