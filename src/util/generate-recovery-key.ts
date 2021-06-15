import { getRandomValue } from "@lindorm-io/core";

export const generateRecoveryKey = (): string =>
  `${getRandomValue(5).toUpperCase()}-` +
  `${getRandomValue(5).toUpperCase()}-` +
  `${getRandomValue(5).toUpperCase()}-` +
  `${getRandomValue(5).toUpperCase()}-` +
  `${getRandomValue(5).toUpperCase()}-` +
  `${getRandomValue(5).toUpperCase()}`;
