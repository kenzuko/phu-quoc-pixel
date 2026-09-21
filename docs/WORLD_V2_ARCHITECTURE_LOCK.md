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

A place is represented as connected zones, named nodes and evidence-backed relationships, not a mood board.

The place graph may contain districts, squares, landmarks, transport anchors, waterfront anchors and venues.

The graph is not a single 2D or 1D ordering. It separates at least three kinds of spatial evidence:

- plan position - north/south/east/west from coordinates or mapped geometry
- elevation - above/below or a verified local level change
- adjacency/connectivity - near, contains, connects, faces, inland/seaward

These axes must not be collapsed into one terrace rank.

A route is a separate product of evidence. The system must not convert a place graph into a driveable route simply because the graph is connected.

For Sunset Town, the previous linear hierarchy `Cable Car -> Sunset Bazaar -> Kiss Stage -> Kiss Bridge` is explicitly REVOKED.

Current approved facts are narrower:
- Clock Tower / Sunset Bazaar / Cable Car / Kiss Bridge have independent plan anchors.
- Sunset Bazaar is north of Cable Car in plan.
- Kiss Bridge is west/seaward of the inland Bazaar/Cable line.
- Cable Car is locally above Kiss of the Sea Stage by one level.
- Kiss Stage is adjacent to the Kiss Bridge waterfront cluster.
- Sunset Bazaar has no approved terrace rank relative to Cable Car or Kiss Stage.

A world plate, map or gameplay route must preserve these separate facts rather than inventing a linear terrace chain.

A segment may define geographic anchor, direction/openness, slope, left and right spatial mass, landmarks visible from the segment, ordinary ambient actors, light/time state, allowed gameplay slots, and reference evidence.

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


## World plate rule

Before a driveable route is approved, V2 may render evidence-backed world plates.

A world plate:
- visualises a verified place relationship or visual identity
- may compress distance for presentation
- must state whether it is spatially verified, corroborated or visual-only
- must not imply a route order unless route evidence exists

World plates are an inspection stage between the Reality Pack and gameplay. They are not decorative concept art and are not permission to invent missing streets.


## Operator field-reference rule

Direct operator/local corrections may be recorded as `field-note` evidence when they resolve spatial relationships that public maps or promotional diagrams flatten or misrepresent.

A field-note:
- must state exactly what relationship it confirms
- may approve elevation / terrace / inland-seaward relations
- must not be silently generalized into unrelated geometry
- can override a prior V2 schematic assumption when the assumption is demonstrably wrong

The first Sunset Town terrace correction dated 2026-09-21 was itself too broad. The spatial rescan later the same day supersedes it: operator field evidence may confirm a local level relationship without assigning every nearby landmark to the same vertical chain.

Map orientation note: a supplied promotional Sunset Town diagram is east-up (E at top, N left, S right, W bottom). Its screen direction must never be interpreted as north-up without rotation.


## Operator-approved relative layout

When the operator corrects a local place layout in the spatial editor and supplies the exported JSON, that layout becomes the approved relative-composition layer for the affected nodes.

Rules:
- preserve the exported node coordinates exactly
- treat editor viewport orientation as metadata, not world orientation
- render canonical local plan north-up unless the operator explicitly approves another world orientation
- do not re-normalize the approved layout from geographic coordinates
- keep geographic anchors as a separate cross-check layer
- keep elevation as a separate layer
- a later operator edit may supersede the prior relative layout

Sunset Town operator layout approved 2026-09-21:
- editor capture orientation: east-up
- world orientation: north-up
- west / sea edge: left
- Central Village facing: west toward sea
- nodes: Central Village, Clock Tower, Sunset Bazaar, Apollo Square, Cable Car Station, Kiss of the Sea Stage, Kiss Bridge
- source of truth: `sunset-town-operator-layout.ts`

This operator layout supersedes the previous generated local composition for STP-03, STP-05 and STP-06.


## Composition layer rule

After an operator-approved relative layout exists, world composition may add building mass, plazas, stairs, sea openings, light bands and other visual density around those nodes.

Composition rules:
- composition may attach to an approved node but may not move that node
- massing may be compressed or stylised, but must preserve the approved opening toward sea and the local spatial hierarchy
- visual-only mass must remain distinguishable from verified geometry
- all composition data lives outside the operator layout so future art iteration cannot silently rewrite approved spatial truth

## Route candidate rule

A route candidate may be drawn during World Tour QA before gameplay exists.

A route candidate:
- is explicitly hypothesis-only
- may connect approved nodes for visual inspection
- must never overwrite operator layout, geo anchors or elevation data
- does not authorize gameplay, hazards, scoring or route-lock
- may be rejected or redrawn without changing the underlying place model

Sunset Town first route candidate is QA-only and must not be treated as the NO BRAKES route.


## Sunset Town west-facing correction

Operator correction dated 2026-09-21 supersedes the previous use of East-up as a world-render orientation.

Approved world reading:
- north = up
- south = down
- west = left
- east = right
- sea edge = left
- Central Village looks west toward the sea

The exported drag-editor coordinates remain valid. Only the interpretation of the editor viewport orientation was wrong.
