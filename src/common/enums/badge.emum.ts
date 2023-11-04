/**
 * Enum defining different badge types.
 */
export enum BadgeTypes {
  Badge1 = 'Badge1',

  Badge2 = 'Badge2',

  Badge3 = 'Badge3',

  Badge4 = 'Badge4',

  Badge5 = 'Badge5',
}

/**
 * Mapping object to associate each badge type with a numeric benchmark.
 * @readonly
 */
export const BadgeBenchmarks: Record<BadgeTypes, number> = {
  [BadgeTypes.Badge1]: 25,
  [BadgeTypes.Badge2]: 50,
  [BadgeTypes.Badge3]: 150,
  [BadgeTypes.Badge4]: 200,
  [BadgeTypes.Badge5]: 300,
};
