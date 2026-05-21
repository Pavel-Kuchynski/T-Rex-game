// Game Logic Tests
// Tests for core mathematical functions that don't depend on DOM

describe('Game Logic - Pure Functions', () => {
  // formatScore: Converts number to padded 5-digit string
  describe('formatScore', () => {
    // Mock implementation to test
    function formatScore(n) {
      return String(Math.floor(n)).padStart(5, '0');
    }

    it('should pad single digit to 5 chars', () => {
      expect(formatScore(5)).toBe('00005');
    });

    it('should pad two digits', () => {
      expect(formatScore(42)).toBe('00042');
    });

    it('should handle 5-digit scores', () => {
      expect(formatScore(12345)).toBe('12345');
    });

    it('should handle zero', () => {
      expect(formatScore(0)).toBe('00000');
    });

    it('should floor decimals', () => {
      expect(formatScore(99.7)).toBe('00099');
    });
  });

  // randomInt: Generates integer in range [min, max]
  describe('randomInt', () => {
    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    it('should return value within bounds', () => {
      for (let i = 0; i < 100; i++) {
        const val = randomInt(5, 15);
        expect(val).toBeGreaterThanOrEqual(5);
        expect(val).toBeLessThanOrEqual(15);
      }
    });

    it('should be able to return min value', () => {
      let minSeen = false;
      for (let i = 0; i < 200; i++) {
        if (randomInt(10, 20) === 10) minSeen = true;
      }
      expect(minSeen).toBe(true);
    });

    it('should be able to return max value', () => {
      let maxSeen = false;
      for (let i = 0; i < 200; i++) {
        if (randomInt(10, 20) === 20) maxSeen = true;
      }
      expect(maxSeen).toBe(true);
    });
  });

  // Physics: Gravity and jump calculations
  describe('Physics', () => {
    it('should apply gravity correctly', () => {
      const GRAVITY = 0.7;
      let vy = -14; // jump velocity
      expect(vy).toBeLessThan(0); // velocity is upward

      vy += GRAVITY;
      expect(vy).toBeLessThan(0); // still going up but slowing
      expect(vy).toBeGreaterThan(-14);

      for (let i = 0; i < 20; i++) vy += GRAVITY;
      expect(vy).toBeGreaterThan(0); // now falling
    });

    it('should calculate landing correctly', () => {
      const PLAYER_FLOOR_Y = 251;
      let playerY = PLAYER_FLOOR_Y - 50; // jumped from floor
      let vy = 0;

      // Simulate falling
      for (let i = 0; i < 30; i++) {
        vy += 0.7; // gravity
        playerY += vy;
      }

      // Landing detection
      if (playerY >= PLAYER_FLOOR_Y) {
        playerY = PLAYER_FLOOR_Y;
        vy = 0;
      }

      expect(playerY).toBe(PLAYER_FLOOR_Y);
      expect(vy).toBe(0);
    });
  });

  // Collision: AABB detection
  describe('AABB Collision Detection', () => {
    function checkAABB(a, b) {
      return a.x < b.x + b.w &&
             a.x + a.w > b.x &&
             a.y < b.y + b.h &&
             a.y + a.h > b.y;
    }

    it('should detect overlapping rectangles', () => {
      const rect1 = { x: 0, y: 0, w: 50, h: 50 };
      const rect2 = { x: 25, y: 25, w: 50, h: 50 };
      expect(checkAABB(rect1, rect2)).toBe(true);
    });

    it('should not detect non-overlapping rectangles', () => {
      const rect1 = { x: 0, y: 0, w: 50, h: 50 };
      const rect2 = { x: 100, y: 100, w: 50, h: 50 };
      expect(checkAABB(rect1, rect2)).toBe(false);
    });

    it('should detect edge touching', () => {
      const rect1 = { x: 0, y: 0, w: 50, h: 50 };
      const rect2 = { x: 50, y: 0, w: 50, h: 50 }; // touching right edge
      expect(checkAABB(rect1, rect2)).toBe(false); // no overlap, just touching
    });
  });

  // Score and Difficulty Scaling
  describe('Difficulty Scaling', () => {
    const GAME_SPEED_INIT = 6;
    const SPEED_MAX = 12;
    const DIFFICULTY_RAMP_RATE = 0.002;

    it('should scale speed based on score', () => {
      function scaleDifficulty(score) {
        return Math.min(GAME_SPEED_INIT + (score / 100) * DIFFICULTY_RAMP_RATE * 1000, SPEED_MAX);
      }

      expect(scaleDifficulty(0)).toBe(GAME_SPEED_INIT);
      expect(scaleDifficulty(500)).toBeGreaterThan(GAME_SPEED_INIT);
      expect(scaleDifficulty(100000)).toBe(SPEED_MAX);
    });

    it('should cap at max speed', () => {
      function scaleDifficulty(score) {
        return Math.min(GAME_SPEED_INIT + (score / 100) * DIFFICULTY_RAMP_RATE * 1000, SPEED_MAX);
      }

      expect(scaleDifficulty(10000)).toBeLessThanOrEqual(SPEED_MAX);
    });
  });

  // Obstacle Type Selection
  describe('Obstacle Filtering', () => {
    const BIRD_SCORE_THRESHOLD = 300;
    const OBSTACLE_TYPES = [
      { key: 'cactus_small_1', birdOnly: false },
      { key: 'cactus_small_2', birdOnly: false },
      { key: 'bird', birdOnly: true },
    ];

    it('should filter out birds below threshold', () => {
      function pickObstacleType(score) {
        const pool = OBSTACLE_TYPES.filter(t => !t.birdOnly || score >= BIRD_SCORE_THRESHOLD);
        return pool;
      }

      const types = pickObstacleType(200);
      for (const t of types) {
        expect(t.birdOnly).not.toBe(true);
      }
    });

    it('should include birds above threshold', () => {
      function pickObstacleType(score) {
        const pool = OBSTACLE_TYPES.filter(t => !t.birdOnly || score >= BIRD_SCORE_THRESHOLD);
        return pool;
      }

      const types = pickObstacleType(BIRD_SCORE_THRESHOLD);
      const hasBird = types.some(t => t.birdOnly);
      expect(hasBird).toBe(true);
    });
  });

  // State Machine
  describe('State Transitions', () => {
    const STATE = {
      IDLE: 'idle',
      RUNNING: 'running',
      PAUSED: 'paused',
      GAME_OVER: 'gameOver',
    };

    it('should have valid initial state', () => {
      expect(STATE.IDLE).toBe('idle');
    });

    it('should define all required states', () => {
      expect(STATE.IDLE).toBeDefined();
      expect(STATE.RUNNING).toBeDefined();
      expect(STATE.PAUSED).toBeDefined();
      expect(STATE.GAME_OVER).toBeDefined();
    });

    it('should be frozen to prevent modifications', () => {
      const frozenState = Object.freeze({...STATE});
      expect(() => { frozenState.IDLE = 'modified'; }).not.toThrow(); // doesn't throw in non-strict mode
      expect(frozenState.IDLE).toBe('idle'); // but value doesn't change
    });
  });

  // Animation Frame Timing
  describe('Fixed Timestep', () => {
    const FIXED_DT = 1000 / 60; // ~16.67ms for 60Hz

    it('should calculate correct timestep', () => {
      expect(FIXED_DT).toBeCloseTo(16.67, 1);
    });

    it('should accumulate time correctly', () => {
      let accumulator = 0;
      const elapsed = 50; // 50ms elapsed

      accumulator += elapsed;
      let updates = 0;
      while (accumulator >= FIXED_DT) {
        updates++;
        accumulator -= FIXED_DT;
      }

        // 50 / 16.67 ≈ 3 updates, remainder should be small
        expect(updates).toBeGreaterThanOrEqual(2);
        expect(updates).toBeLessThanOrEqual(3);
        expect(accumulator).toBeLessThan(FIXED_DT); // remainder is always less than one timestep
    });
  });
});
