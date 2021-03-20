import { CRYPTO_PASSWORD_OPTIONS } from "../../config";
import { CryptoPassword } from "@lindorm-io/crypto";
import { Device } from "../../entity";
import { InvalidDeviceSecretError } from "../../error/InvalidDeviceSecretError";

const crypto = new CryptoPassword(CRYPTO_PASSWORD_OPTIONS);

export const encryptDeviceSecret = async (secret: string): Promise<string> => {
  return crypto.encrypt(secret);
};

export const assertDeviceSecret = async (device: Device, secret: string): Promise<void> => {
  try {
    await crypto.assert(secret, device.secret.signature);
  } catch (err) {
    throw new InvalidDeviceSecretError(device.id, err);
  }
};
