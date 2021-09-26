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
