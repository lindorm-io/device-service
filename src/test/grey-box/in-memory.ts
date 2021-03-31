export let inMemoryCache: Record<string, any> = {};
export let inMemoryStore: Record<string, any> = {};

export const resetCache = (): void => {
  inMemoryCache = {};
};

export const resetStore = (): void => {
  inMemoryStore = {};
};
