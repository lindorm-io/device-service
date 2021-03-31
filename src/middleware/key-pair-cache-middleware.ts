import { keyPairCacheMiddleware } from "@lindorm-io/koa-keystore";
import { AUTH_KEYSTORE_NAME, DEVICE_KEYSTORE_NAME } from "../constant";

export const authKeyPairCacheMiddleware = keyPairCacheMiddleware({
  keystoreName: AUTH_KEYSTORE_NAME,
});

export const deviceKeyPairCacheMiddleware = keyPairCacheMiddleware({
  keystoreName: DEVICE_KEYSTORE_NAME,
});
