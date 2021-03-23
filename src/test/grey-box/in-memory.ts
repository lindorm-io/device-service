import { KeyPair } from "@lindorm-io/key-pair";

export let inMemoryKeys: Array<KeyPair> = [];
export let inMemoryStore: Record<string, any> = {};

export const resetStore = (): void => {
  inMemoryStore = {};
};

export const resetKeys = (): void => {
  inMemoryKeys = [];
};
