# T-Rex Game Implementation Plan

## Current Status
- [x] Phase 1: Setup and Skeleton
- [x] Phase 2: Core Game Engine
- [x] Phase 3: Player (T-Rex) Mechanics
- [x] Phase 4: Obstacles and World
- [x] Phase 5: Collision, Scoring, and Difficulty
- [ ] Phase 6: Input and UX (in progress)
- [ ] Phase 7: Persistence and Polish
- [ ] Phase 8: Testing and Validation

## Goal
Build a browser-based endless runner inspired by the Chrome Dino game using JavaScript, HTML5 Canvas, and CSS.

## Technical Stack
- JavaScript (vanilla)
- HTML5 Canvas
- CSS

## Project Structure
- index.html
- styles.css
- script.js
- plan.md
- README.md
- assets/ (optional for sprites and sounds)

## Phase 1: Setup and Skeleton
1. Create base files: index.html, styles.css, script.js.
2. Add a canvas element and basic page layout.
3. Set up CSS for responsive centering and HUD placeholders.
4. Initialize JavaScript bootstrap and game loop scaffold.

## Phase 2: Core Game Engine
1. Implement game states: idle, running, paused, gameOver.
2. Build the main loop with requestAnimationFrame.
3. Add fixed or semi-fixed timestep logic for stable updates.
4. Implement reset/start/pause/restart transitions.

## Phase 3: Player (T-Rex) Mechanics
1. Define player position, size, velocity, and grounded state.
2. Implement jump physics:
   - jump impulse
   - gravity
   - landing detection
3. Prevent double-jump while airborne.
4. Add simple running and jump animations (placeholder shapes first).

## Phase 4: Obstacles and World
1. Create obstacle types (small cactus, large cactus, optional bird).
2. Implement obstacle spawn scheduler with randomized intervals.
3. Move obstacles from right to left based on game speed.
4. Remove off-screen obstacles to avoid memory growth.

## Phase 5: Collision, Scoring, and Difficulty
1. Implement AABB collision detection with small hitbox tuning.
2. Trigger gameOver on collision.
3. Increase score over time and/or passed obstacles.
4. Scale difficulty gradually:
   - increase speed by score/time
   - cap max speed

## Phase 6: Input and UX
1. Desktop input:
   - Space / ArrowUp: jump
   - P or Escape: pause
   - R: restart
2. Mobile input:
   - Tap: jump
   - On-screen pause/restart controls
3. Prevent default scroll behavior during gameplay inputs.
4. Add overlays for start, pause, and gameOver states.

## Phase 7: Persistence and Polish
1. Save best score in localStorage.
2. Add optional sound effect hooks (jump, score milestone, hit).
3. Improve visual polish in CSS (ground line, contrast, spacing).
4. Add lightweight accessibility:
   - keyboard-first controls
   - ARIA status text for game state

## Phase 8: Testing and Validation
1. Functional tests:
   - jump behavior
   - spawn timing
   - collision correctness
   - restart reset behavior
2. Input tests across desktop and mobile.
3. Performance tests:
   - stable frame rate over 5+ minutes
   - no unbounded obstacle/object growth
4. Compatibility checks in modern browsers.

## Risks and Mitigation
- Unfair collisions: tune hitboxes and playtest.
- Difficulty spikes too fast: use gradual speed ramp and cap.
- Mobile input misfires: debounce touch and separate action zones.
- Performance drops: keep render logic simple and clean objects promptly.

## Definition of Done
- Playable endless runner in browser.
- Working jump, obstacle spawning, collision, score, speed scaling.
- Pause and restart functioning.
- Best score persists across reloads.
- Controls work on both keyboard and touch.
- No major console errors during normal play.
