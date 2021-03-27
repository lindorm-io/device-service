import { KeyPair } from "@lindorm-io/key-pair";

export let inMemoryCache: Record<string, any> = {};
export let inMemoryKeys: Array<KeyPair> = [];
export let inMemoryStore: Record<string, any> = {};

export const resetCache = (): void => {
  inMemoryCache = {};
};

export const resetKeys = (): void => {
  inMemoryKeys = [];
};

export const resetStore = (): void => {
  inMemoryStore = {};
};
