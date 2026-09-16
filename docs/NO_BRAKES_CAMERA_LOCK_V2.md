# NO BRAKES CAMERA LOCK V2

Status: APPROVED DIRECTION
Viewport: 540 x 960 logical pixels, portrait 9:16
Reference: approved Phu Quoc Pixel / Sunset Town artwork plus the approved rear-chase gameplay composition supplied by product owner.

## Camera

- Third-person rear chase view.
- Never side-scroll the gameplay camera.
- Rider sits in the lower third of the frame.
- Vanishing point is near screen centre, around y = 438 on the 960 px logical canvas.
- Road begins narrow near the horizon and grows strongly toward the camera.
- Player stays readable against the road and is not hidden by HUD.
- The camera does not swing wildly during lane changes. The rider moves laterally while the world remains stable.

## Projection

- Road centre x = 270.
- Road top half-width = 28 px.
- Road bottom half-width = 246 px.
- Projection uses a strong non-linear depth curve so distant objects remain small and close objects grow quickly.
- Three soft lanes converge to the same vanishing point.
- Obstacles and JO COIN spawn near the horizon and use the same projection as the road.
- Render depth follows world depth so close objects can visually pass in front of farther objects.

## Player composition

- Default playable base: The Traveler.
- Rear-view scooter/rider art is required for the final gameplay asset.
- Player anchor is in the lower gameplay area, approximately y = 860-880.
- Lane changes use a short eased transition and a small lean.
- TAP / CLICK / SPACE = jump.
- SWIPE LEFT / RIGHT = lane dodge.
- Swipe must never be interpreted as jump.

## World art

- Real Phu Quoc first.
- Sunset Town must remain location-specific: Mediterranean shophouses, Clock Tower, Kiss Bridge, sea, An Thoi cable-car context and coastal hillside.
- Approved review sheets and locked masters define visual continuity.
- Do not substitute generic tropical-town scenery.
- Do not bake gameplay UI, coins, player or temporary obstacles into the background artwork.

## Gameplay readability

- JO COIN lines can invite lane changes.
- Obstacles must be recognisable tourism / street objects, not debug rectangles.
- Early hazards teach timing before full lane randomness.
- Motion effects are supporting accents only. Sunset Town remains the visual hero.

## Art pipeline rule

The approved handoff review sheets are visual-production references, not transparent sprite sheets. Clean rear-view player, obstacle and parallax exports must be produced as dedicated production assets before they replace placeholders in the runtime.
