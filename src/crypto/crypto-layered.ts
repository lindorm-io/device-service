import { CryptoLayered } from "@lindorm-io/crypto";
import { config } from "../config";

export const cryptoLayered = new CryptoLayered({
  aes: { secret: config.CRYPTO_AES_SECRET },
  sha: { secret: config.CRYPTO_SHA_SECRET },
});
