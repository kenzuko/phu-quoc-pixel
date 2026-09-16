# NO BRAKES - ART RESET V1

Status: LOCKED FOR REBUILD
Domain target: https://pixel.openphuquoc.com
Logical viewport: 540 x 960 portrait
Primary location: Sunset Town, Phu Quoc

## 1. Why this reset exists

The current No Brakes build is a technical prototype only. Its scene flow, input, score/progress contract and production build pipeline can be retained, but the visible game layer is not approved.

Known visual failures in the prototype:

- player and scooter proportions do not read as a coherent character animation
- two-frame texture swapping looks like jitter, not riding motion
- background perspective/depth is inconsistent
- Sunset Town does not read strongly enough as a specific real place
- obstacles are visually inconsistent and some previous prototype references point to missing assets
- hit silhouettes and rendered silhouettes are not designed together
- road motion does not sell speed
- jump, landing and collision have insufficient feedback
- mobile presentation still feels like a canvas inside a webpage instead of a game

No prototype art is considered approved production art.

## 2. Visual north star

The player should understand the scene in under three seconds:

`I am riding fast through Sunset Town in Phu Quoc.`

Sunset Town reference characteristics that must survive the pixel translation:

- west-facing golden-hour / sunset light
- Mediterranean / Amalfi-inspired multi-level facades
- colorful buildings stepping down a hillside toward the sea
- recognizable South Phu Quoc coastal context
- cable-car presence may appear as distant environmental storytelling, never as a foreground gameplay object in this mini-game
- warm stone, terracotta, pastel facades, sea blue and sunset orange should dominate before decorative detail

The game is playful and energetic, not nostalgic, gloomy or generic tropical pixel art.

## 3. Camera and composition

Gameplay remains portrait 540 x 960.

Composition zones:

- 0-250 px: sky, sunset glow, distant cable-car silhouettes / small moving cabins when appropriate
- 180-430 px: sea horizon and distant Sunset Town hillside silhouette
- 300-650 px: primary Mediterranean facade layer and recognizable architectural rhythm
- 560-760 px: street-edge / promenade layer
- 735-960 px: gameplay road, player, obstacles, foreground FX

The road must remain the clearest contrast zone. Background detail must never compete with obstacles.

## 4. Parallax contract

Background must be split into independent layers. Do not use one flattened full-screen painting as the final implementation.

Recommended motion factors relative to road speed:

1. sky / sun: 0.00-0.02
2. distant sea / horizon: 0.04-0.07
3. far hillside buildings: 0.10-0.14
4. mid architecture: 0.20-0.28
5. promenade / rail / lamps: 0.40-0.55
6. road markings / foreground props: 1.00-1.25

Movement must be pixel-snapped where practical to avoid shimmer.

## 5. Player contract

Player identity for the first vertical slice: Traveler riding a small scooter.

Production player asset must be a real sprite set, not runtime-generated SVG and not a two-frame placeholder.

Minimum approved states:

- ride idle / cruise: 4 frames minimum
- hop takeoff: 1-2 frames
- airborne: 1 frame minimum
- landing: 2 frames minimum
- collision: 2 frames minimum

Required visual behavior:

- subtle vertical suspension bounce during cruise
- wheels / body must imply forward motion
- 2-4 degree lean response during hop, not random rotation
- anticipation squash before hop should be small and readable
- landing compression should last roughly 80-130 ms
- collision silhouette must remain readable at full speed

Player display size may change after final sprite approval. Hitbox must be authored from the approved visible silhouette, not inherited from the prototype dimensions.

## 6. Obstacle family

Obstacles must belong to one Sunset Town street vocabulary and be recognizable in under 150 ms.

Initial family:

- stone / terracotta planter
- cafe chair cluster
- small cafe table
- A-frame menu board
- camera tripod / tourist photo setup
- suitcase or compact luggage trolley

Rules:

- every obstacle requires transparent PNG/WebP with clean silhouette
- no black or white fallback rectangles
- every asset has an explicit visual width, collision width and ground anchor
- collision box must be documented next to the asset
- obstacles need at least three silhouette widths so rhythm does not feel repetitive
- decorative items are not allowed to masquerade as collision objects

## 7. Motion and game feel

The scene must communicate speed before difficulty becomes high.

Required effects:

- moving road dashes / paving rhythm
- foreground speed streaks introduced progressively, not at score 0
- tiny dust / tire particles on landing and high-speed road contact
- player shadow that scales slightly while airborne
- short camera impulse on hard landing
- collision flash + brief shake + local particle burst
- obstacle near-miss may get a subtle whoosh later, but not required for first pass

Avoid excessive screen shake. Readability is more important than spectacle.

## 8. Lighting and palette

The base scene is late-afternoon / golden-hour Sunset Town, not full night.

Palette hierarchy:

1. warm sunset sky
2. cool sea separation
3. pastel Mediterranean architecture
4. darker road foreground
5. JoTrip yellow as selective UI / reward accent, never washing the world in brand color

Architecture needs enough shadow separation to remain legible on mobile.

## 9. UI integration

HUD must feel embedded in the game world rather than developer debug text.

Keep:

- score
- JO
- best

Change:

- reduce heavy monospace/debug feel
- keep high contrast without large opaque panels during gameplay
- tutorial/result panels may use pixel-frame treatment derived from the world palette
- safe-area handling is mandatory on iPhone

## 10. Mobile presentation

The game should feel fullscreen even when hosted as a web game.

Acceptance:

- canvas occupies the available viewport without visually dead webpage space
- portrait remains the canonical composition
- desktop centers the portrait game without stretching it
- no browser-scroll interaction during play
- touch targets remain at least 44 CSS px where they map to UI controls
- no image smoothing on production pixel assets

## 11. Asset approval pipeline

No art asset goes directly from generation/drawing into gameplay.

Required states:

`reference -> style frame -> isolated asset -> in-engine preview -> approved -> production registry`

Each approved production asset must have:

- canonical filename
- source / provenance note
- native dimensions
- intended display dimensions
- anchor point
- collision rectangle if applicable
- checksum in the asset manifest
- approval status

Temporary art must live outside the production registry and be named clearly as `wip` or `reference`.

## 12. First art milestone

Do not rebuild every screen at once.

The first visual milestone is one static gameplay style frame containing:

- approved Sunset Town background composition
- approved Traveler + scooter scale
- road layer
- one approved planter obstacle
- HUD treatment
- representative sunset lighting

Only after this frame is visually approved should the assets be separated and animated.

## 13. Technical code that may remain

The following concepts can remain from the technical prototype unless a later QA gate disproves them:

- Phaser runtime
- TypeScript/Vite foundation
- scene lifecycle
- FlowController
- InputActions abstraction
- ProgressStore contract
- lazy asset-group concept
- No Brakes score/difficulty state model as a starting point

The current visual dimensions, textures, hitboxes and background rendering are explicitly NOT locked.

## 14. Definition of done for No Brakes visual rebuild

A build is not visually done until all are true:

- Sunset Town is recognizable without a text label
- player animation reads as riding rather than texture jitter
- every collision object is immediately readable
- no missing/fallback assets
- parallax creates speed without shimmer
- jump/landing/collision each have distinct feedback
- mobile screenshot fills the intended game presentation cleanly
- desktop screenshot preserves pixel integrity
- production E2E still passes after art integration
- art review is approved before the next location mini-game starts
