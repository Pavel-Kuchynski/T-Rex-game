# Phase 4 Prompt: Obstacles and World

Status: COMPLETED

Implement only Phase 4 of the T-Rex game.

## Scope
1. Create obstacle types: small cactus, large cactus, optional bird.
2. Implement obstacle spawn scheduler with randomized intervals.
3. Move obstacles right-to-left based on game speed.
4. Remove off-screen obstacles to prevent memory growth.

## Pictures To Prepare (Mandatory)
1. cactus_small_1.png
	- Size: 17x35 px.
	- Background: transparent.
	- Style: black silhouette, simple branching shape.
2. cactus_small_2.png
	- Size: 17x35 px.
	- Background: transparent.
	- Style: small variation from cactus_small_1.png for visual diversity.
3. cactus_large_1.png
	- Size: 25x50 px.
	- Background: transparent.
	- Style: black silhouette, taller branching profile.
4. cactus_large_2.png
	- Size: 25x50 px.
	- Background: transparent.
	- Style: variation from cactus_large_1.png with similar visual weight.
5. bird_flap_up.png (optional obstacle enabled by difficulty)
	- Size: 46x40 px.
	- Background: transparent.
	- Style: black silhouette with wings up.
6. bird_flap_down.png (optional obstacle enabled by difficulty)
	- Size: 46x40 px.
	- Background: transparent.
	- Style: same bird body, wings down for two-frame flap animation.

## Mandatory Characteristics For All Phase 4 Pictures
- File format must be PNG.
- Use transparent background only.
- Use single dark foreground color consistent with T-Rex assets.
- Keep obstacle contact point aligned to ground baseline.
- Preserve exact dimensions for predictable hitbox setup.
- Naming must match exactly for obstacle loader mapping.

## Rules
- Do not add collision or scoring logic yet.
- Keep obstacle management efficient.

## Deliverables
- Obstacles spawn and move continuously.
- Off-screen cleanup works consistently.
- Mandatory obstacle and bird picture set prepared and mapped to obstacle types.
