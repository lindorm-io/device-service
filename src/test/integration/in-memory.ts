export let inMemoryAxios: Record<string, any> = {};

export const resetAxios = (): void => {
  inMemoryAxios = {};
};

export const resetAll = (): void => {
  resetAxios();
};
