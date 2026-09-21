export const SceneKeys = {
  Boot: 'BootScene',
  V2Hub: 'V2HubScene',
  IslandMapV2: 'IslandMapV2Scene',
  SunsetWorldTour: 'SunsetWorldTourScene',
  Landing: 'LandingScene',
  Airport: 'AirportScene',
  Character: 'CharacterScene',
  IslandMap: 'IslandMapScene',
  NoBrakes: 'NoBrakesScene',
  Result: 'ResultScene'
} as const;

export type SceneKey = (typeof SceneKeys)[keyof typeof SceneKeys];
