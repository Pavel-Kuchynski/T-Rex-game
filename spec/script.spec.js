// Load DOM mock and script.js before running tests
require('./helpers/setup.js');

// ── Score Formatting Tests ────────────────────────────────────────────────
describe('formatScore', () => {
beforeEach(() => {
  // Reset all game state before each test
  score = 0;
  bestScore = 0;
  gameSpeed = GAME_SPEED_INIT;
  state = STATE.IDLE;
  accumulator = 0;
  player.x = PLAYER_X;
  player.y = PLAYER_FLOOR_Y;
  player.vy = 0;
  player.grounded = true;
  player.animFrame = 0;
  player.animTick = 0;
  obstacles = [];
  passedObstacles = [];
  spawnTimer = 0;
  spawnInterval = SPAWN_MIN;
});

  it('should pad single digit to 5 chars', () => {
    expect(formatScore(5)).toBe('00005');
  });

  it('should pad two digits to 5 chars', () => {
    expect(formatScore(42)).toBe('00042');
  });

  it('should pad three digits to 5 chars', () => {
    expect(formatScore(123)).toBe('00123');
  });

  it('should handle 5-digit score without padding', () => {
    expect(formatScore(12345)).toBe('12345');
  });

  it('should handle 6-digit score', () => {
    expect(formatScore(123456)).toBe('123456');
  });

  it('should handle zero', () => {
    expect(formatScore(0)).toBe('00000');
  });

  it('should floor decimal scores', () => {
    expect(formatScore(42.7)).toBe('00042');
  });
});

// ── Random Integer Tests ──────────────────────────────────────────────────
describe('randomInt', () => {
afterEach(() => {
  score = 0;
  obstacles = [];
  passedObstacles = [];
});

  it('should return integer within min and max bounds', () => {
    for (let i = 0; i < 100; i++) {
      const val = randomInt(1, 10);
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(10);
      expect(Number.isInteger(val)).toBe(true);
    }
  });

  it('should be able to return min value', () => {
    let minReached = false;
    for (let i = 0; i < 1000; i++) {
      if (randomInt(5, 10) === 5) minReached = true;
    }
    expect(minReached).toBe(true);
  });

  it('should be able to return max value', () => {
    let maxReached = false;
    for (let i = 0; i < 1000; i++) {
      if (randomInt(5, 10) === 10) maxReached = true;
    }
    expect(maxReached).toBe(true);
  });

  it('should handle single-value range', () => {
    expect(randomInt(5, 5)).toBe(5);
  });
});

// ── Player Hitbox Tests ───────────────────────────────────────────────────
describe('getPlayerHitbox', () => {
  beforeEach(() => {
    player.x = PLAYER_X;
    player.y = PLAYER_FLOOR_Y;
  });

  it('should return padded hitbox object', () => {
    const hb = getPlayerHitbox();
    expect(hb).toEqual(jasmine.objectContaining({
      x: jasmine.any(Number),
      y: jasmine.any(Number),
      w: jasmine.any(Number),
      h: jasmine.any(Number),
    }));
  });

  it('should apply horizontal padding', () => {
    const hb = getPlayerHitbox();
    expect(hb.x).toBe(PLAYER_X + HITBOX_PAD_X);
    expect(hb.w).toBe(PLAYER_W - HITBOX_PAD_X * 2);
  });

  it('should apply vertical padding', () => {
    const hb = getPlayerHitbox();
    expect(hb.y).toBe(PLAYER_FLOOR_Y + HITBOX_PAD_Y);
    expect(hb.h).toBe(PLAYER_H - HITBOX_PAD_Y * 2);
  });

  it('should track player movement', () => {
    const hb1 = getPlayerHitbox();
    player.x = 100;
    player.y = 150;
    const hb2 = getPlayerHitbox();
    expect(hb2.x).toBeGreaterThan(hb1.x);
    expect(hb2.y).toBeGreaterThan(hb1.y);
  });
});

// ── Collision Detection Tests ─────────────────────────────────────────────
describe('checkCollisions', () => {
  beforeEach(() => {
    player.x = PLAYER_X;
    player.y = PLAYER_FLOOR_Y;
    obstacles = [];
  });

  it('should return false when no obstacles present', () => {
    expect(checkCollisions()).toBe(false);
  });

  it('should detect collision when obstacle overlaps player', () => {
    obstacles.push({
      x: PLAYER_X + 5,
      y: PLAYER_FLOOR_Y,
      w: 30,
      h: 40,
    });
    expect(checkCollisions()).toBe(true);
  });

  it('should not detect collision when obstacle is to the right', () => {
    obstacles.push({
      x: PLAYER_X + PLAYER_W + 50,
      y: PLAYER_FLOOR_Y,
      w: 20,
      h: 40,
    });
    expect(checkCollisions()).toBe(false);
  });

  it('should not detect collision when obstacle is to the left', () => {
    obstacles.push({
      x: PLAYER_X - 50,
      y: PLAYER_FLOOR_Y,
      w: 20,
      h: 40,
    });
    expect(checkCollisions()).toBe(false);
  });

  it('should not detect collision when obstacle is above', () => {
    obstacles.push({
      x: PLAYER_X + 5,
      y: PLAYER_FLOOR_Y - 80,
      w: 30,
      h: 20,
    });
    expect(checkCollisions()).toBe(false);
  });

  it('should detect collision with multiple obstacles', () => {
    obstacles.push(
      { x: PLAYER_X - 100, y: 100, w: 20, h: 40 },
      { x: PLAYER_X + 10, y: PLAYER_FLOOR_Y, w: 30, h: 40 },
      { x: PLAYER_X + 200, y: 100, w: 20, h: 40 }
    );
    expect(checkCollisions()).toBe(true);
  });
});

// ── Jump Physics Tests ────────────────────────────────────────────────────
describe('jump', () => {
  beforeEach(() => {
    player.grounded = true;
    player.vy = 0;
  });

  it('should initiate jump when grounded', () => {
    jump();
    expect(player.vy).toBe(JUMP_VY);
    expect(player.grounded).toBe(false);
  });

  it('should prevent double-jump when airborne', () => {
    player.vy = -5;
    player.grounded = false;
    const initialVy = player.vy;
    jump();
    expect(player.vy).toBe(initialVy);
  });

  it('should allow jump again after landing', () => {
    jump();
    player.grounded = true;
    jump();
    expect(player.vy).toBe(JUMP_VY);
  });
});

// ── Player Update Tests ───────────────────────────────────────────────────
describe('updatePlayer', () => {
  beforeEach(() => {
    player.x = PLAYER_X;
    player.y = PLAYER_FLOOR_Y;
    player.vy = 0;
    player.grounded = true;
    player.animTick = 0;
    player.animFrame = 0;
  });

  it('should apply gravity when airborne', () => {
    player.vy = 0;
    player.grounded = false;
    updatePlayer();
    expect(player.vy).toBeGreaterThan(0);
  });

  it('should detect landing at floor', () => {
    player.y = PLAYER_FLOOR_Y - 10;
    player.vy = 5;
    player.grounded = false;
    updatePlayer();
    expect(player.y).toBe(PLAYER_FLOOR_Y);
    expect(player.vy).toBe(0);
    expect(player.grounded).toBe(true);
  });

  it('should cycle run animation when grounded', () => {
    expect(player.animFrame).toBe(0);
    for (let i = 0; i < ANIM_SPEED; i++) updatePlayer();
    expect(player.animFrame).toBe(1);
    for (let i = 0; i < ANIM_SPEED; i++) updatePlayer();
    expect(player.animFrame).toBe(0);
  });

  it('should not animate run cycle while jumping', () => {
    player.grounded = false;
    player.vy = -5;
    const initialFrame = player.animFrame;
    for (let i = 0; i < ANIM_SPEED + 5; i++) updatePlayer();
    expect(player.animFrame).toBe(initialFrame);
  });
});

// ── Difficulty Scaling Tests ──────────────────────────────────────────────
describe('scaleDifficulty', () => {
  beforeEach(() => {
    score = 0;
    gameSpeed = GAME_SPEED_INIT;
  });

  it('should start at initial speed with score 0', () => {
    scaleDifficulty();
    expect(gameSpeed).toBe(GAME_SPEED_INIT);
  });

  it('should increase speed with score', () => {
    score = 500;
    scaleDifficulty();
    expect(gameSpeed).toBeGreaterThan(GAME_SPEED_INIT);
  });

  it('should cap speed at maximum', () => {
    score = 100000;
    scaleDifficulty();
    expect(gameSpeed).toBeLessThanOrEqual(SPEED_MAX);
  });

  it('should scale smoothly with increasing scores', () => {
    score = 100;
    scaleDifficulty();
    const speed1 = gameSpeed;
    score = 200;
    scaleDifficulty();
    const speed2 = gameSpeed;
    expect(speed2).toBeGreaterThan(speed1);
  });
});

// ── Obstacle Type Selection Tests ─────────────────────────────────────────
describe('pickObstacleType', () => {
  beforeEach(() => {
    score = 0;
  });

  it('should only return cactus types when score below bird threshold', () => {
    score = 100;
    for (let i = 0; i < 20; i++) {
      const type = pickObstacleType();
      expect(type.birdOnly).not.toBe(true);
    }
  });

  it('should allow bird types when score at or above threshold', () => {
    score = BIRD_SCORE_THRESHOLD;
    let birdFound = false;
    for (let i = 0; i < 100; i++) {
      const type = pickObstacleType();
      if (type.birdOnly) birdFound = true;
    }
    expect(birdFound).toBe(true);
  });

  it('should return a valid obstacle type', () => {
    const type = pickObstacleType();
    expect(type).toEqual(jasmine.objectContaining({
      key: jasmine.any(String),
      w: jasmine.any(Number),
      h: jasmine.any(Number),
      sprites: jasmine.any(Array),
    }));
  });
});

// ── Reset Function Tests ──────────────────────────────────────────────────
describe('reset', () => {
  it('should reset score to 0', () => {
    score = 500;
    reset();
    expect(score).toBe(0);
  });

  it('should reset accumulator to 0', () => {
    accumulator = 100;
    reset();
    expect(accumulator).toBe(0);
  });

  it('should reset player state', () => {
    player.y = 50;
    player.vy = 10;
    player.grounded = false;
    reset();
    expect(player.y).toBe(PLAYER_FLOOR_Y);
    expect(player.vy).toBe(0);
    expect(player.grounded).toBe(true);
  });

  it('should clear obstacles', () => {
    obstacles = [{ x: 100, y: 100, w: 20, h: 40 }];
    reset();
    expect(obstacles.length).toBe(0);
  });

  it('should reset game speed', () => {
    gameSpeed = 10;
    reset();
    expect(gameSpeed).toBe(GAME_SPEED_INIT);
  });
});

// ── State Management Tests ────────────────────────────────────────────────
describe('State Management', () => {
  it('should start in IDLE state', () => {
    expect(state).toBe(STATE.IDLE);
  });

  it('should transition from IDLE to RUNNING via startGame', () => {
    startGame();
    expect(state).toBe(STATE.RUNNING);
  });

  it('should transition from RUNNING to PAUSED', () => {
    state = STATE.RUNNING;
    pauseGame();
    expect(state).toBe(STATE.PAUSED);
  });

  it('should transition from PAUSED to RUNNING', () => {
    state = STATE.PAUSED;
    resumeGame();
    expect(state).toBe(STATE.RUNNING);
  });

  it('should transition from RUNNING to GAME_OVER', () => {
    state = STATE.RUNNING;
    endGame();
    expect(state).toBe(STATE.GAME_OVER);
  });

  it('pauseGame should do nothing if not running', () => {
    state = STATE.PAUSED;
    pauseGame();
    expect(state).toBe(STATE.PAUSED);
  });

  it('endGame should do nothing if not running', () => {
    state = STATE.PAUSED;
    endGame();
    expect(state).toBe(STATE.PAUSED);
  });

  it('startGame should reset score', () => {
    score = 500;
    startGame();
    expect(score).toBe(0);
  });
});

// ── Obstacle State Tests ──────────────────────────────────────────────────
describe('Obstacle Management', () => {
  it('should start with empty obstacles array', () => {
    resetObstacles();
    expect(obstacles.length).toBe(0);
  });

  it('should spawn obstacle at canvas right edge', () => {
    spawnObstacle();
    expect(obstacles[0].x).toBe(CANVAS_WIDTH);
  });

  it('should spawn obstacle at correct ground position', () => {
    spawnObstacle();
    const obs = obstacles[0];
    expect(obs.y).toBe(GROUND_Y - obs.h);
  });

  it('should have spawn timer initialized', () => {
    resetObstacles();
    expect(spawnTimer).toBeGreaterThanOrEqual(SPAWN_MIN);
    expect(spawnTimer).toBeLessThanOrEqual(SPAWN_MAX);
  });
});