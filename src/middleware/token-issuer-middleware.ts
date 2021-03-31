import { tokenIssuerMiddleware } from "@lindorm-io/koa-jwt";
import { config } from "../config";
import {
  AUTH_KEYSTORE_NAME,
  AUTH_TOKEN_ISSUER_NAME,
  DEVICE_KEYSTORE_NAME,
  DEVICE_TOKEN_ISSUER_NAME,
} from "../constant";

export const authTokenIssuerMiddleware = tokenIssuerMiddleware({
  issuer: config.AUTH_JWT_ISSUER,
  issuerName: AUTH_TOKEN_ISSUER_NAME,
  keystoreName: AUTH_KEYSTORE_NAME,
});

export const deviceTokenIssuerMiddleware = tokenIssuerMiddleware({
  issuer: config.DEVICE_JWT_ISSUER,
  issuerName: DEVICE_TOKEN_ISSUER_NAME,
  keystoreName: DEVICE_KEYSTORE_NAME,
});
