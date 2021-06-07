import { config } from "../../config";
import { Keystore } from "@lindorm-io/key-pair";
import { TokenIssuer } from "@lindorm-io/jwt";
import { getTestKeyPairEC } from "./test-key-pair";
import { logger } from "./test-logger";

export const getTestAuthIssuer = (): TokenIssuer =>
  new TokenIssuer({
    issuer: config.AUTH_JWT_ISSUER,
    keystore: new Keystore({ keys: [getTestKeyPairEC()] }),
    logger,
  });

export const getTestDeviceIssuer = (): TokenIssuer =>
  new TokenIssuer({
    issuer: config.DEVICE_JWT_ISSUER,
    keystore: new Keystore({ keys: [getTestKeyPairEC()] }),
    logger,
  });

export const getTestIssuer = () => ({
  authIssuer: getTestAuthIssuer(),
  deviceIssuer: getTestDeviceIssuer(),
});
