import { CRYPTO_PASSWORD_OPTIONS } from "../../config";
import { CryptoPassword } from "@lindorm-io/crypto";
import { Device } from "../../entity";
import { InvalidDevicePINError } from "../../error/InvalidDevicePINError";

const crypto = new CryptoPassword(CRYPTO_PASSWORD_OPTIONS);

export const encryptDevicePIN = async (pin: string): Promise<string> => {
  return crypto.encrypt(pin);
};

export const assertDevicePIN = async (device: Device, pin: string): Promise<void> => {
  try {
    await crypto.assert(pin, device.pin.signature);
  } catch (err) {
    throw new InvalidDevicePINError(device.id, err);
  }
};
