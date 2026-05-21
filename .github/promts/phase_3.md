# Phase 3 Prompt: Player (T-Rex) Mechanics

Status: COMPLETED

Implement only Phase 3 of the T-Rex game.

## Scope
1. Define player position, size, velocity, and grounded state.
2. Implement jump physics: jump impulse, gravity, landing detection.
3. Prevent double-jump while airborne.
4. Add simple running and jump animations using placeholder shapes.

## Pictures To Prepare (Mandatory)
1. trex_run_1.png
	- Size: 44x47 px.
	- Background: transparent.
	- Style: black silhouette, pixel-friendly edges.
	- Pose: left leg forward, right leg back, body level.
2. trex_run_2.png
	- Size: 44x47 px.
	- Background: transparent.
	- Style: identical to trex_run_1.png.
	- Pose: opposite legs from frame 1 for a clear running cycle.
3. trex_jump.png
	- Size: 44x47 px.
	- Background: transparent.
	- Style: identical silhouette thickness and color.
	- Pose: both legs tucked or neutral jump posture.
4. trex_duck_1.png (optional for future extension)
	- Size: 59x30 px.
	- Background: transparent.
	- Style: same silhouette and line weight as other T-Rex frames.
5. trex_duck_2.png (optional for future extension)
	- Size: 59x30 px.
	- Background: transparent.
	- Style: alternate duck leg posture for simple animation.

## Mandatory Characteristics For All Phase 3 Pictures
- File format must be PNG.
- Use transparent background only (no white matte).
- Use a single dark foreground color (#222 to #111 range).
- Keep sprite baseline aligned so feet contact the same ground Y level.
- Keep a 1 to 2 px empty margin around the outer shape to avoid clipping.
- Naming must match exactly for predictable loading.

## Rules
- Do not add obstacle logic in this phase.
- Tune constants so jump feels responsive.

## Deliverables
- Playable jump behavior with reliable landing.
- Basic visual animation for running/jumping states.
- Mandatory T-Rex picture set prepared and integrated for animation.
