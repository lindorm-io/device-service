import { config } from "../../config";
import { CryptoSecret } from "@lindorm-io/crypto";
import { Device } from "../../entity";
import { InvalidDeviceRecoveryKeyError } from "../../error";
import { getRandomNumber } from "@lindorm-io/core";

const crypto = new CryptoSecret({
  aesSecret: config.CRYPTO_AES_SECRET,
  shaSecret: config.CRYPTO_SHA_SECRET,
});

export interface ICreateDeviceRecoveryKey {
  recoveryKey: string;
  signature: string;
}

export interface ICreateMultipleRecoveryKeys {
  recoveryKeys: Array<string>;
  signatures: Array<string>;
}

export const encryptDeviceRecoveryKey = async (recoveryKey: string): Promise<string> => {
  return await crypto.encrypt(recoveryKey);
};

export const assertDeviceRecoveryKey = async (device: Device, pin: string): Promise<void> => {
  for (const signature of device.recoveryKeys) {
    const verified = await crypto.verify(pin, signature);
    if (verified) return;
  }
  throw new InvalidDeviceRecoveryKeyError(device.id);
};

export const createDeviceRecoveryKey = async (): Promise<ICreateDeviceRecoveryKey> => {
  const recoveryKey = `${await getRandomNumber(6)}-${await getRandomNumber(6)}-${await getRandomNumber(6)}`;
  const signature = await encryptDeviceRecoveryKey(recoveryKey);

  return {
    recoveryKey,
    signature,
  };
};

export const createDeviceRecoveryKeys = async (amount: number): Promise<ICreateMultipleRecoveryKeys> => {
  const recoveryKeys: Array<string> = [];
  const signatures: Array<string> = [];

  for (let i = 0; i < amount; i += 1) {
    const { recoveryKey, signature } = await createDeviceRecoveryKey();

    recoveryKeys.push(recoveryKey);
    signatures.push(signature);
  }

  return {
    recoveryKeys,
    signatures,
  };
};
