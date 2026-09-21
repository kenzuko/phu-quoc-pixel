# GAMEPLAY CRITIQUE & DNA NOTES

Date: 2026-09-21  
Status: WORKING NOTES - NOT YET A PRODUCT LOCK

These notes preserve the current critique direction for PHU QUOC: PIXEL ISLAND. They are deliberately non-binding so the design can continue to be challenged before implementation.

## Core product thesis

GamePixel should not become a large game, a tourism brochure with mini-games, or a generic runner with Phu Quoc artwork.

The desired loop is:

```
SEE -> UNDERSTAND -> RISK -> COMMIT -> ALMOST -> FAIL -> TAUNT -> RETRY -> MASTER
```

Underneath that loop:

```
PLACE -> MEMORY -> DISCOVERY
```

A good GamePixel module should make the player think:
- I understood why I failed.
- I can do better next run.
- That place felt different from every other location.
- I want to retry or explore another location.

## Rage without unfairness

The game should create playful frustration, not random punishment.

Target emotional sequence after failure:

```
"What?" -> "Ah, my mistake." -> "Again."
```

Avoid:
- impossible obstacle combinations
- unreadable collision
- fake difficulty spikes
- unavoidable deaths
- unstable input latency
- random obstacle generation without solvability guarantees

Prefer:
- greed traps
- near misses
- best-score pressure
- readable but demanding patterns
- fast revenge retry
- contextual teasing

## Difficulty philosophy

Difficulty must not be a simple linear speed curve.

Preferred tension rhythm:

```
easy -> build -> tension -> release -> stronger build -> false safety -> climax -> release
```

A future Rage/Tension Director may use:
- recent near miss
- recent lane changes
- recent JO collection
- current score vs best score
- time since last pressure moment
- recent hard-pattern survival

The purpose is emotional pacing, not dynamic cheating.

## Pattern grammar

Replace pure random obstacle spawning with authored pattern grammar.

Example structure:

```
SETUP -> TEMPT -> COMMIT -> PUNISH -> RELEASE
```

Patterns may be mirrored or reskinned, but should remain fair and learnable.

Every generated pattern must preserve at least one valid survival action from every valid entry state.

## Greed is a mechanic

JO should create tempting decisions, not only passive collection.

Examples:
- safe lane with no JO
- risky lane with a JO chain
- late escape window
- optional high-value path
- reward visible before commitment

The player should sometimes lose because they chose greed, not because the game cheated.

## Near-miss system

Near misses should be detected and rewarded with feedback:
- light camera response
- whoosh sound
- dust / skid effect
- short contextual text

Near misses should feel dramatic even when collision boxes are slightly forgiving.

Collision boxes may intentionally be smaller than visible sprites to create fair-feeling close escapes.

## Contextual taunts

GamePixel may tease the player, but must not insult them.

Good examples:
- CLOSE.
- LUCKY.
- GREEDY?
- ONE MORE.
- YOU SAW IT.
- THAT WAS QUICK.
- WORTH IT?
- OKAY. YOU CAN RIDE.

Avoid:
- NOOB
- BAD PLAYER
- YOU SUCK
- insults or humiliation

Taunts should be selected from actual run context, such as:
- early death
- death near best score
- greedy JO death
- late lane switch
- long run
- new best
- near-miss streak

## Best score as psychological pressure

The current best score should become part of the emotional game.

Examples:
- 8 TO BEST
- 4 TO BEST
- ONE MORE.
- BEST TIED
- NEW BEST

A death one point before the best score should feel especially painful but fair.

## Revenge retry

Retry should be almost immediate.

Target flow:

```
CRASH -> brief reaction -> RESULT -> RETRY -> GO
```

No repeated tutorial, cinematic, loading screen, or unnecessary navigation after the player already understands the game.

## Tutorial philosophy

Teach through safe interaction rather than auto-playing for the user.

Possible structure:
- first obstacle: slow, strongly telegraphed, non-lethal bump
- second obstacle: mild penalty
- third obstacle onward: normal rules

The player should feel that they learned, not that the game played for them.

## Place mechanic rule

Phu Quoc must affect gameplay, not only background art.

Each location should have one or more mechanics that belong to the place.

Examples:
- Sunset Town: slopes, streets, electric shuttles, golden-hour descent
- Hon Thom: height, cable-car context, sea below
- Bai Sao: sand, water, waves
- Night Market: crowd flow, stalls, food chaos
- Safari: animal movement patterns

If a module could be moved to another city with only a background swap, its place identity is too weak.

## Signature moment

Every mini-game needs at least one visually and mechanically memorable moment.

For NO BRAKES:
- street opens
- downhill descent
- sea becomes visible
- golden-hour horizon
- JO trail becomes tempting
- gameplay tension peaks at the same time as the visual climax

A five-second clip should be recognizable as Sunset Town / Phu Quoc.

## Progression

Avoid turning JO into a commercial economy early.

JO should first support:
- collection
- bragging
- progression
- unlockable visual memories

Existing `mapPieces` is a promising lightweight layer.

Possible rewards:
- pixel postcard
- map piece
- golden map piece
- sticker
- secret visual detail
- location stamp

Do not introduce energy systems, daily chests, forced ads, spin wheels, pay-to-win, or manipulative countdown mechanics.

## Secrets and replay

Small discoverable events can create stronger sharing than large reward systems.

Examples:
- Phu Quoc ridgeback cameo
- hidden local object
- rare NPC
- environmental easter egg
- secret action sequence

Secrets should reward curiosity without becoming mandatory.

## HUD restraint

During live gameplay, visual priority is:

```
road -> obstacle -> player -> JO
```

HUD should remain minimal.

Likely persistent HUD:
- SCORE
- JO
- BEST

Mode titles and tutorial/debug state should fade out or disappear once play begins.

## Camera and speed

Perceived speed should come partly from presentation rather than only increasing reaction difficulty.

Possible tools:
- subtle camera lean
- road parallax
- edge motion
- controlled shake
- light speed streaks
- motion sound

This preserves fairness while increasing intensity.

## Audio

Audio is part of game feel, not decoration.

Important feedback:
- JO pickup
- near miss
- lane change
- jump
- landing
- crash
- new best
- score pressure

Music should not become too dense. Ambient Phu Quoc / location sound plus dynamic rhythmic layers may fit better than constant heavy music.

## Performance as gameplay

For a reaction game, latency and frame pacing affect fairness.

Track:
- input latency
- frame time
- dropped frames
- scene startup time
- retry latency

Menu/map can degrade more gracefully, but live NO BRAKES gameplay should aim to stay substantially above a 30 FPS floor whenever possible.

Reduce effects before sacrificing control responsiveness.

## Deterministic QA

Gameplay should support seeded pattern playback.

A run may record:
- seed
- score
- patternId
- lane
- action history
- death cause
- death context

This makes unfairness reproducible instead of anecdotal.

## Telemetry

Useful anonymous gameplay events:
- run_start
- run_end
- score
- duration
- death_pattern
- death_lane
- retry
- quit
- near_miss
- jo_collected
- best_score

The important product metrics are not simply session length.

More useful:
- retry rate after death
- abandon rate after death
- completion / fail distribution by pattern
- another-location rate after a session

## Architecture critique to resolve before scaling

Current implementation should be brought back in line with the existing architecture before a second mini-game is added.

Known drift:
1. BootScene still loads multiple master/game assets directly instead of enforcing staged AssetRegistry groups.
2. IslandMapScene hard-codes Sunset Town hit zones instead of rendering interaction from ISLAND_LOCATIONS.
3. NoBrakesScene owns its own result UI while the architecture defines a shared Result flow.
4. Raw asset paths still exist in scenes.
5. LoadingScene and AudioManager are not yet implemented.
6. Automated tests / E2E / production smoke are not yet complete.

These issues are manageable now but become expensive after multiple locations exist.

## Current build principle

Do not add a second mini-game yet.

First prove one production-quality vertical slice where the complete emotional loop works:

```
fast entry
-> immediate understanding
-> satisfying control
-> recognizable Phu Quoc identity
-> fair tension
-> near miss / greed / failure
-> contextual taunt
-> instant retry
-> mastery / reward
-> return to map
-> desire to explore another place
```

Only after that formula is proven should the game expand location by location.
