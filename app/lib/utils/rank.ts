export type Ranked<T> = T & { rank: number };

export const withRank = <T>(items: T[]): Ranked<T>[] =>
  items.map((item, i) => ({ ...item, rank: i + 1 }));
