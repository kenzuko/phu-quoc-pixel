# PHU QUOC: PIXEL ISLAND - WORLD V2 ARCHITECTURE LOCK

Date: 2026-09-21
Status: LOCKED FOR V2 IMPLEMENTATION

## Core inversion

V1 built gameplay first and then made Phu Quoc fit around the game. V2 reverses that dependency:

REAL PHU QUOC -> Reality Pack -> Geo / Place Model -> Place Graph -> Route / Scene Segments -> Verified Pixel World -> Gameplay Slots -> Mini Game

The place owns the world. A mini game runs through the place.

## One source of truth

Island map, local map, landmark placement, route geometry, scene boundaries and gameplay routes must derive from one world model. A map is a rendering of the world model, not an independent illustration with independently placed POIs.

## Reality Pack

Every place must have a versioned Reality Pack before production art is approved. Each reference records source, capture/publication date where known, coordinates where known, what the reference proves, confidence, usage status, and license/attribution notes when relevant.

Reference sources should combine geographic data, recent geotagged photography, aerial imagery, official place information, and street/traveler footage for ordinary life. Marketing images alone are insufficient.

## Reality epoch

Every place declares a reality epoch, for example `sunset-town: 2026-09`. Phu Quoc changes quickly. Future updates replace or extend place data rather than silently rewriting historical source evidence.

## Faithful compression

Game space may compress reality.

Allowed:
- shorten distance
- exaggerate readable width
- simplify secondary streets
- exaggerate light and colour
- reduce object density
- compress travel time

Not allowed without explicit evidence:
- reverse landmark order
- move a major landmark to the wrong side
- reverse the direction of the sea opening
- invent an incompatible architectural zone
- invent place-specific traffic/props simply to serve gameplay
- change major geographic relationships

Rule: **Compress distance, not spatial truth.**

## Place graph

A place is represented as connected zones and segments, not a mood board. A segment may define geographic anchor, direction/openness, slope, left and right spatial mass, landmarks visible from the segment, ordinary ambient actors, light/time state, allowed gameplay slots, and reference evidence.

## Verified scene rule

Production world art must be traceable:

`frame -> scene segment -> anchors -> references`

Runtime may compose approved layers and animate them. Runtime must not procedurally invent major architecture to fill missing evidence. Unknown is allowed to remain unknown.

## Confidence

World facts carry confidence:
- VERIFIED - direct authoritative/geotagged evidence
- HIGH - corroborated by multiple references
- MEDIUM - plausible and partially corroborated
- LOW - weak evidence; must not drive a major visual claim

LOW data may be omitted or represented generically. It must not be promoted to a landmark fact.

## Map rule

The island map uses the same geographic anchors as world scenes. Coastline and place geometry are geographic first. Presentation may be pixel-stylized; icon scale and label spacing may be exaggerated for readability.

Map entities are not all pins:
- `point` - a feature that can honestly be represented as one location
- `area` - a district, attraction complex, park or settlement; the label point is representative, not the feature boundary
- `coast` - a named shoreline / beach; render the shoreline segment rather than pretending the beach is a single point

A point may never silently stand in for an area or coast merely because it is easier to render.

Rule: **Geometry faithful, presentation playful.**

## World Tour gate

A new place cannot receive gameplay until it passes World Tour QA. World Tour contains no score, JO, hazards, rage director or gameplay pressure. It exists only to inspect spatial sequence, landmark relationships, openness, place identity, visual density, light and ordinary life.

If the world does not read as the place without gameplay labels, the place fails.

## Gameplay contract

Gameplay is applied only through place-defined slots. A gameplay director may choose among allowed hazards and patterns. It may not change the world or invent unsupported place objects.

NO BRAKES owns movement, input, scoring, fairness, patterns, tension, taunts and retry.

Sunset Town owns route, environment, landmark sequence, ambient actors, allowable hazards and spatial identity.

## Fairness rule

The Rage Director may choose the next challenge based on prior play. After a challenge has been telegraphed, the game must not change it in response to the player's committed input in order to force failure.

## V1 handling

V1 is frozen as reference. Do not delete V1 history. Do not continue patching V1 world construction into V2.

V1 may be used for approved control feel, gameplay observations, reusable audited services and visual comparison. V1 world assumptions are not inherited automatically.

## V2 pilot

Sunset Town is the pilot.

Reality Pack -> World data contracts -> Island Map V2 -> Sunset Town World Tour -> World QA -> player -> gameplay -> pattern grammar -> Rage Director -> audio/ambient life -> production QA

No second place is implemented before the Sunset Town V2 pipeline proves itself.

## QA principle

"Looks nice" is not a pass condition.

World QA asks:
- Is the geographic relationship correct?
- Is the segment supported by references?
- Is the landmark where it should be?
- Is world density plausible?
- Does the scene remain recognisable without labels?
- Did gameplay distort the place?

The architecture is violated if implementation fixes a gameplay problem by falsifying the place when another gameplay solution exists.
