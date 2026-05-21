'use strict';

// ── Constants ─────────────────────────────────────────────────────────────
const CANVAS_WIDTH  = 800;
const CANVAS_HEIGHT = 300;
const FIXED_DT      = 1000 / 60; // fixed timestep in ms (60 Hz)
const MAX_ACCUM     = FIXED_DT * 5; // clamp accumulator to avoid spiral of death
const SCORE_PER_SEC = 10; // score points earned per second of play

// ── Player Constants ──────────────────────────────────────────────────────
const PLAYER_X       = 60;                  // fixed horizontal position (px)
const PLAYER_W       = 44;                  // sprite width (px)
const PLAYER_H       = 47;                  // sprite height (px)
const GROUND_Y       = CANVAS_HEIGHT - 2;   // top of ground line
const PLAYER_FLOOR_Y = GROUND_Y - PLAYER_H; // player y when standing
const JUMP_VY        = -14;                 // upward velocity on jump (px/tick)
const GRAVITY        = 0.7;                 // downward acceleration (px/tick²)
const ANIM_SPEED     = 8;                   // ticks between run-cycle frames

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

// ── Sprites ───────────────────────────────────────────────────────────────
function loadSprite(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const sprites = {
  run1: loadSprite('assets/sprites/trex_run_1.svg'),
  run2: loadSprite('assets/sprites/trex_run_2.svg'),
  jump: loadSprite('assets/sprites/trex_jump.svg'),
};

// ── Player State ──────────────────────────────────────────────────────────
const player = {
  x:         PLAYER_X,
  y:         PLAYER_FLOOR_Y,
  vy:        0,
  grounded:  true,
  animFrame: 0,
  animTick:  0,
};

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

// ── Player Functions ─────────────────────────────────────────────────────
function resetPlayer() {
  player.x         = PLAYER_X;
  player.y         = PLAYER_FLOOR_Y;
  player.vy        = 0;
  player.grounded  = true;
  player.animFrame = 0;
  player.animTick  = 0;
}

function jump() {
  if (!player.grounded) return; // prevent double-jump
  player.vy       = JUMP_VY;
  player.grounded = false;
}

function updatePlayer() {
  player.vy += GRAVITY;
  player.y  += player.vy;

  // Landing detection
  if (player.y >= PLAYER_FLOOR_Y) {
    player.y        = PLAYER_FLOOR_Y;
    player.vy       = 0;
    player.grounded = true;
  }

  // Run-cycle animation (only while grounded)
  if (player.grounded) {
    player.animTick++;
    if (player.animTick >= ANIM_SPEED) {
      player.animTick  = 0;
      player.animFrame = 1 - player.animFrame;
    }
  }
}

function drawPlayer() {
  const sprite = player.grounded
    ? (player.animFrame === 0 ? sprites.run1 : sprites.run2)
    : sprites.jump;

  if (sprite.complete && sprite.naturalWidth > 0) {
    ctx.drawImage(sprite, Math.round(player.x), Math.round(player.y), PLAYER_W, PLAYER_H);
  } else {
    // Fallback rectangle until sprites finish loading
    ctx.fillStyle = '#111';
    ctx.fillRect(Math.round(player.x), Math.round(player.y), PLAYER_W, PLAYER_H);
  }
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
  resetPlayer();
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
  updatePlayer();
}

// ── Render ────────────────────────────────────────────────────────────────
function render() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Ground line
  ctx.fillStyle = '#222';
  ctx.fillRect(0, CANVAS_HEIGHT - 2, CANVAS_WIDTH, 2);

  drawPlayer();
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
    if (state === STATE.RUNNING) jump();
    else handleAction();
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
  if (state === STATE.RUNNING) jump();
  else handleAction();
}, { passive: false });

overlayBtn.addEventListener('click', () => {
  handleAction();
});

// ── Start ─────────────────────────────────────────────────────────────────
init();
