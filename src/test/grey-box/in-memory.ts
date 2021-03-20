import { TObject } from "@lindorm-io/core";
import { KeyPair } from "@lindorm-io/key-pair";

export let inMemoryStore: TObject<any> = {};

export const resetStore = (): void => {
  inMemoryStore = {};
};

export let inMemoryKeys: Array<KeyPair> = [];

export const resetKeys = (): void => {
  inMemoryKeys = [];
};
