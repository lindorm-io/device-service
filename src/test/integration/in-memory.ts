export let inMemoryAxios: Record<string, any> = {};
export let inMemoryCache: Record<string, any> = {};
export let inMemoryStore: Record<string, any> = {};

export const resetAxios = (): void => {
  inMemoryAxios = {};
};

export const resetCache = (): void => {
  inMemoryCache = {};
};

export const resetStore = (): void => {
  inMemoryStore = {};
};

export const resetAll = (): void => {
  resetAxios();
  resetCache();
  resetStore();
};
