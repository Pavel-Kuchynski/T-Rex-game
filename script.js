'use strict';

// ── Constants ──────────────────────────────────────────────────────────────
const CANVAS_WIDTH  = 800;
const CANVAS_HEIGHT = 300;
const FPS_TARGET    = 60;
const FRAME_BUDGET  = 1000 / FPS_TARGET; // ms per frame

// ── Game States ───────────────────────────────────────────────────────────
const STATE = Object.freeze({
  IDLE:      'idle',
  RUNNING:   'running',
  PAUSED:    'paused',
  GAME_OVER: 'gameOver',
});

// ── Canvas Setup ──────────────────────────────────────────────────────────
const canvas  = document.getElementById('game-canvas');
const ctx     = canvas.getContext('2d');

// ── HUD elements ─────────────────────────────────────────────────────────
const scoreEl     = document.getElementById('score');
const bestScoreEl = document.getElementById('best-score');
const overlay     = document.getElementById('overlay');
const overlayMsg  = document.getElementById('overlay-message');
const overlayBtn  = document.getElementById('overlay-btn');

// ── Game State ────────────────────────────────────────────────────────────
let state       = STATE.IDLE;
let lastTime    = 0;
let rafId       = null;

// ── Helpers ───────────────────────────────────────────────────────────────
function formatScore(n) {
  return String(Math.floor(n)).padStart(5, '0');
}

function showOverlay(message, btnLabel) {
  overlayMsg.textContent  = message;
  overlayBtn.textContent  = btnLabel;
  overlay.classList.remove('hidden');
}

function hideOverlay() {
  overlay.classList.add('hidden');
}

function setState(next) {
  state = next;

  if (next === STATE.IDLE) {
    showOverlay('Press Space or Tap to Start', 'START');
  } else if (next === STATE.PAUSED) {
    showOverlay('Paused', 'RESUME');
  } else if (next === STATE.GAME_OVER) {
    showOverlay('Game Over', 'RESTART');
  } else if (next === STATE.RUNNING) {
    hideOverlay();
  }
}

// ── Render ────────────────────────────────────────────────────────────────
function render() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Ground line
  ctx.fillStyle = '#222';
  ctx.fillRect(0, CANVAS_HEIGHT - 2, CANVAS_WIDTH, 2);

  // Placeholder: score display on canvas (mirrored from HUD)
  // Real score/entities will be drawn in later phases
}

// ── Update ────────────────────────────────────────────────────────────────
function update(/*delta*/) {
  // Gameplay logic will be added in Phase 2+
}

// ── Game Loop ─────────────────────────────────────────────────────────────
function loop(timestamp) {
  rafId = requestAnimationFrame(loop);

  const delta = timestamp - lastTime;

  // Skip frames that are wildly slow (e.g. tab was hidden)
  if (delta > FRAME_BUDGET * 5) {
    lastTime = timestamp;
    return;
  }

  if (delta < FRAME_BUDGET) return; // wait for next budget window
  lastTime = timestamp;

  if (state === STATE.RUNNING) {
    update(delta);
  }

  render();
}

function startLoop() {
  if (rafId) cancelAnimationFrame(rafId);
  lastTime = performance.now();
  rafId = requestAnimationFrame(loop);
}

// ── Bootstrap ─────────────────────────────────────────────────────────────
function init() {
  setState(STATE.IDLE);
  startLoop();
}

// ── Input ─────────────────────────────────────────────────────────────────
function handleAction() {
  if (state === STATE.IDLE || state === STATE.GAME_OVER) {
    setState(STATE.RUNNING);
  } else if (state === STATE.PAUSED) {
    setState(STATE.RUNNING);
  }
}

function handlePause() {
  if (state === STATE.RUNNING) {
    setState(STATE.PAUSED);
  }
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
