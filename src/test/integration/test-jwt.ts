import { TokenIssuer } from "@lindorm-io/jwt";
import { config } from "../../config";
import { getTestKeystore } from "./test-keystore";
import { logger } from "../logger";

export const getTestJwt = (): TokenIssuer =>
  new TokenIssuer({
    issuer: config.BEARER_TOKEN_ISSUER,
    keystore: getTestKeystore(),
    logger,
  });

export const getTestDeviceJwt = (): TokenIssuer =>
  new TokenIssuer({
    issuer: config.HOST,
    keystore: getTestKeystore(),
    logger,
  });
