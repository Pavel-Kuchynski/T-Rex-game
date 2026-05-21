'use strict';

// ── Constants ─────────────────────────────────────────────────────────────
const CANVAS_WIDTH  = 800;
const CANVAS_HEIGHT = 300;
const FIXED_DT      = 1000 / 60; // fixed timestep in ms (60 Hz)
const MAX_ACCUM     = FIXED_DT * 5; // clamp accumulator to avoid spiral of death
const SCORE_PER_SEC = 10; // score points earned per second of play

// ── Game States ───────────────────────────────────────────────────────────
const STATE = Object.freeze({
  IDLE:      'idle',
  RUNNING:   'running',
  PAUSED:    'paused',
  GAME_OVER: 'gameOver',
});

// ── Canvas Setup ──────────────────────────────────────────────────────────
const canvas = document.getElementById('game-canvas');
const ctx    = canvas.getContext('2d');

// ── HUD Elements ──────────────────────────────────────────────────────────
const scoreEl     = document.getElementById('score');
const bestScoreEl = document.getElementById('best-score');
const overlay     = document.getElementById('overlay');
const overlayMsg  = document.getElementById('overlay-message');
const overlayBtn  = document.getElementById('overlay-btn');

// ── Mutable Engine State ──────────────────────────────────────────────────
let state     = STATE.IDLE;
let rafId     = null;
let lastTime  = 0;
let accumulator = 0;

// ── Mutable Game Variables (reset on each new game) ───────────────────────
let score     = 0;
let bestScore = 0;

// ── Helpers ───────────────────────────────────────────────────────────────
function formatScore(n) {
  return String(Math.floor(n)).padStart(5, '0');
}

function updateHUD() {
  scoreEl.textContent     = formatScore(score);
  bestScoreEl.textContent = formatScore(bestScore);
}

function showOverlay(message, btnLabel) {
  overlayMsg.textContent = message;
  overlayBtn.textContent = btnLabel;
  overlay.classList.remove('hidden');
}

function hideOverlay() {
  overlay.classList.add('hidden');
}

// ── State Machine ─────────────────────────────────────────────────────────
function setState(next) {
  state = next;

  if (next === STATE.IDLE) {
    showOverlay('Press Space or Tap to Start', 'START');
  } else if (next === STATE.RUNNING) {
    hideOverlay();
  } else if (next === STATE.PAUSED) {
    showOverlay('Paused', 'RESUME');
  } else if (next === STATE.GAME_OVER) {
    if (score > bestScore) bestScore = score;
    updateHUD();
    showOverlay('Game Over', 'RESTART');
  }
}

// ── Reset ─────────────────────────────────────────────────────────────────
// Clears all per-round variables. Called on every new game start.
function reset() {
  score       = 0;
  accumulator = 0;
  updateHUD();
  // Phase 3+ will reset player / obstacles here
}

// ── Transitions ───────────────────────────────────────────────────────────
function startGame() {
  reset();
  setState(STATE.RUNNING);
}

function pauseGame() {
  if (state !== STATE.RUNNING) return;
  setState(STATE.PAUSED);
}

function resumeGame() {
  if (state !== STATE.PAUSED) return;
  // Resync lastTime so the accumulator doesn't count paused time as elapsed
  lastTime = performance.now();
  accumulator = 0;
  setState(STATE.RUNNING);
}

function endGame() {
  if (state !== STATE.RUNNING) return;
  setState(STATE.GAME_OVER);
}

// ── Fixed-Timestep Update ─────────────────────────────────────────────────
// Called once per fixed tick (FIXED_DT ms). All gameplay logic goes here.
function fixedUpdate() {
  score += SCORE_PER_SEC * (FIXED_DT / 1000);
  updateHUD();
  // Phase 3+ will update player and obstacles here
}

// ── Render ────────────────────────────────────────────────────────────────
function render() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Ground line
  ctx.fillStyle = '#222';
  ctx.fillRect(0, CANVAS_HEIGHT - 2, CANVAS_WIDTH, 2);

  // Phase 3+ will draw player and obstacles here
}

// ── Game Loop (semi-fixed timestep with accumulator) ──────────────────────
function loop(timestamp) {
  rafId = requestAnimationFrame(loop);

  const elapsed = timestamp - lastTime;
  lastTime = timestamp;

  if (state === STATE.RUNNING) {
    // Clamp to avoid spiral of death after tab focus restore
    accumulator += Math.min(elapsed, MAX_ACCUM);

    while (accumulator >= FIXED_DT) {
      fixedUpdate();
      accumulator -= FIXED_DT;
    }
  }

  render();
}

// ── Bootstrap ─────────────────────────────────────────────────────────────
function init() {
  updateHUD();
  setState(STATE.IDLE);
  lastTime = performance.now();
  rafId    = requestAnimationFrame(loop);
}

// ── Input ─────────────────────────────────────────────────────────────────
function handleAction() {
  if (state === STATE.IDLE || state === STATE.GAME_OVER) {
    startGame();
  } else if (state === STATE.PAUSED) {
    resumeGame();
  }
}

function handlePause() {
  if (state === STATE.RUNNING) pauseGame();
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    handleAction();
  }
  if (e.code === 'KeyP' || e.code === 'Escape') {
    e.preventDefault();
    handlePause();
  }
  if (e.code === 'KeyR' && state === STATE.GAME_OVER) {
    e.preventDefault();
    startGame();
  }
});

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  handleAction();
}, { passive: false });

overlayBtn.addEventListener('click', () => {
  handleAction();
});

// ── Start ─────────────────────────────────────────────────────────────────
init();
