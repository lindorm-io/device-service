import { DeviceContext } from "../../typing";
import { getTestCache } from "./test-cache";
import { getTestEntity } from "./test-entity";
import { getTestHandler } from "./test-handler";
import { getTestDeviceIssuer } from "./test-issuer";
import { getTestRepository } from "./test-repository";
import { logger } from "./test-logger";

export const context = {
  axios: {},
  agent: {},
  cache: {},
  client: {},
  entity: {},
  handler: {},
  jwt: {},
  keystore: {},
  logger,
  metadata: {},
  metrics: {},
  repository: {},
  token: {},
} as unknown as DeviceContext;

export const getTestContext = async (): Promise<DeviceContext> =>
  ({
    ...context,
    cache: await getTestCache(),
    entity: await getTestEntity(),
    handler: getTestHandler(),
    jwt: getTestDeviceIssuer(),
    repository: await getTestRepository(),
  } as unknown as DeviceContext);
