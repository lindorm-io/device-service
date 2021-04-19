import { logger } from "./test-logger";
import { getTestCache } from "./test-cache";
import { getTestEntity } from "./test-entity";
import { getTestHandler } from "./test-handler";
import { getTestIssuer } from "./test-issuer";
import { getTestRepository } from "./test-repository";

export const context = {
  agent: {},
  cache: {},
  client: {},
  entity: {},
  handler: {},
  issuer: {},
  keystore: {},
  logger,
  metadata: {},
  metrics: {},
  repository: {},
  token: {},
};

export const getTestContext = async () => ({
  ...context,
  cache: await getTestCache(),
  entity: await getTestEntity(),
  handler: getTestHandler(),
  issuer: getTestIssuer(),
  repository: await getTestRepository(),
});
