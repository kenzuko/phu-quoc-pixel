# SUNSET TOWN - REAL-WORLD LAYOUT V1

Status: LOCKED FOR NO BRAKES WORLD BUILD
Purpose: keep the arcade composition recognizable as the real Sunset Town instead of inventing a generic Mediterranean coast.

## 1. Source priority

Use sources in this order when geography conflicts:

1. Official Sunset Town / Sun Group map and brochure
2. Official Sun World / Sun Group aerial photography
3. OpenStreetMap-derived geometry and coordinates
4. Geotagged Wikimedia Commons photos for sightline checks
5. Other travel imagery only as secondary visual reference

Never invent a road, shoreline, bridge position, cable-car alignment or landmark relationship simply because it looks attractive in a style frame.

## 2. Geographic truths that must survive the game compression

- Sunset Town occupies the southwest coast of Phu Quoc around An Thoi.
- The built town climbs a hillside rather than sitting on a flat waterfront strip.
- Mediterranean-style low-rise blocks cascade from the hillside toward the sea.
- Central Village and its 75 m clock tower are a major visual anchor near the waterfront and La Festa area.
- Kiss Bridge is an offshore / waterfront landmark in front of the town and must read as a structure extending across the bay, not as a normal road bridge.
- Anh Duong Square / An Thoi cable-car departure station is a distinct node from Central Village. Do not merge the station into the clock-tower block.
- The Hon Thom cable-car line belongs to the An Thoi station system. Cable cabins should appear in No Brakes only where a verified sightline makes sense. Do not place a decorative cable line arbitrarily across Kiss Bridge.
- The town street network is curved and hillside-driven. Avoid long generic straight boulevards as the final environment.

## 3. No Brakes camera contract

The approved gameplay direction is rear-view pseudo-3D. The final route is an arcade compression of a believable Sunset Town descent, not a literal driving simulator.

Canonical composition:

- foreground: rider + road + collision vocabulary
- near sides: low-rise facades, cafe edges, planters, lamps, railings
- midground: curved descending street / piazza rhythm
- fixed landmark anchor: Central Village clock tower
- background: west-facing sea and sunset
- offshore landmark: Kiss Bridge where the sightline permits it
- cable system: optional distant cue only after sightline validation

The player should be able to remove all HUD text and still say: `This is Sunset Town, Phu Quoc.`

## 4. Compression rules

Allowed:

- shorten real distances
- simplify curves
- reduce building count
- widen the gameplay lane for readability
- shift a landmark modestly within the same visual sector to keep it visible
- exaggerate vertical relief to communicate hillside descent

Not allowed:

- move the sea to the inland side
- turn Kiss Bridge into a roadway crossing the player's street
- put Hon Thom cable-car pylons in arbitrary coastal positions
- flatten the hillside into a generic beach boulevard
- use a landmark from another Phu Quoc area inside Sunset Town
- create fake signature buildings and present them as real landmarks

## 5. World layers for production

Layer 0 - sky / sunset
- static or near-static
- west-facing golden hour

Layer 1 - offshore sea
- low parallax
- boats may be ambient only

Layer 2 - verified landmark silhouettes
- Kiss Bridge
- clock tower
- cable system only if verified for the chosen sightline

Layer 3 - hillside massing
- stepped Mediterranean blocks
- preserve slope direction and density rhythm

Layer 4 - street architecture
- cafe facades
- arcades
- stairs / retaining edges where appropriate
- lamps and railings

Layer 5 - gameplay road
- curved pseudo-3D projection
- road markings must serve play clarity, even if simplified

Layer 6 - gameplay props / obstacles
- planter
- cafe furniture
- A-frame menu
- tourist tripod
- luggage trolley

## 6. Road implementation requirement

`PerspectiveRoad` is the projection engine, not the geographic model.

Before final art, replace the current procedural straight-road proxy with a data-driven route profile:

```text
RouteSample {
  depth
  centerOffset
  halfWidth
  curve
  grade
  leftWorldZone
  rightWorldZone
}
```

This allows the road to bend through a compressed but recognizable Sunset Town instead of remaining a straight vanishing-point corridor.

## 7. Landmark placement contract

Landmarks must be authored as world anchors, separate from decorative scenery.

```text
WorldAnchor {
  id
  source
  realWorldRelationship
  routeDepthRange
  screenSector
  minimumReadableSize
  occlusionRules
  approved
}
```

A landmark can move on screen as the route curves, but its relationship to the coastline and other anchors must remain plausible.

## 8. First route target

For No Brakes V1, build one believable downhill / waterfront approach rather than the whole Sunset Town map.

Visual story:

`hillside street -> denser Mediterranean blocks -> Central Village clock tower becomes dominant -> sea opens up -> Kiss Bridge becomes visible -> run ends / loops before geographic fiction is required`

This gives the mini-game a real-place identity without pretending that every gameplay meter equals a real road meter.

## 9. Verification gate

Before an environment asset is approved:

- compare against at least one official map / brochure
- compare against at least two aerial or elevated real photos
- verify coastline side
- verify landmark ordering
- verify that cable-car elements are not placed solely for decoration
- document any deliberate arcade compression

If a relationship cannot be verified, omit it rather than invent it.

## 10. Current sources

Official Sunset Town map:
https://sunsettown.com.vn/en/sunsettown-map

Sun Group Sunset Town overview:
https://sungroup.com.vn/sunsettown

Sun World travel guide / Central Village clock tower:
https://sunworld.vn/en/hon-thom/travel-guide/kinh-nghiem-du-lich-sunset-town-phu-quoc-tron-ven-va-tiet-kiem-17546

Official Sunset Town / Sun Group Phu Quoc brochure:
https://sunsettown.com.vn/Ebook/ENG_BROCHURE%20HST%202S%20PHU%20QUOC_27032024_VIEW%20ko%20in.pdf

OpenStreetMap-derived An Thoi Cable Car Station reference:
https://mapcarta.com/W1185867234

Wikimedia geotagged Kiss Bridge imagery for sightline reference:
https://commons.wikimedia.org/wiki/File:Kiss_Bridge,_Phu_Quoc_(52680897656).jpg

## 11. Current production implication

The colorful style-frame direction is approved as mood and camera language only.

It is NOT approved as geography.

The current procedural `PerspectiveRoad` background is a mechanics proxy. It must be replaced by the real-world world-layer system described above before No Brakes art is considered production-ready.
