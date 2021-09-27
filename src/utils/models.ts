import { createSelector } from 'reselect';

export function normalizeCollection<T extends Record<string, any>>(
  collection: T[],
  key: keyof T = 'id',
) {
  const ids: string[] = [];
  const byId: Record<string, T> = {};

  collection.forEach((element) => {
    const id = element[key];
    ids.push(id);
    byId[id] = element;
  });

  return { ids, byId };
}

export function denormalizeCollection<T>(state: T) {
  return createSelector(
    (s: T) => s,
    // @ts-ignore
    ({ ids, byId }) => ids.map((id) => byId[id]),
  )(state);
}
