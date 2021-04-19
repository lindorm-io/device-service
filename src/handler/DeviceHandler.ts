import { CryptoPassword, CryptoSecret } from "@lindorm-io/crypto";
import { IKoaDeviceContext } from "../typing";
import { InvalidDevicePINError, InvalidDeviceRecoveryKeyError, InvalidDeviceSecretError } from "../error";
import { KoaDeviceContextAware } from "../class";
import { config } from "../config";
import { getRandomNumber, getRandomValue } from "@lindorm-io/core";

export class DeviceHandler extends KoaDeviceContextAware {
  private password: CryptoPassword;
  private secret: CryptoSecret;

  constructor(ctx: IKoaDeviceContext) {
    super(ctx);

    this.password = new CryptoPassword({
      aesSecret: config.CRYPTO_AES_SECRET,
      shaSecret: config.CRYPTO_SHA_SECRET,
    });

    this.secret = new CryptoSecret({
      aesSecret: config.CRYPTO_AES_SECRET,
      shaSecret: config.CRYPTO_SHA_SECRET,
    });
  }

  public async encryptPin(pin: string): Promise<string> {
    return await this.password.encrypt(pin);
  }

  public async assertPin(pin: string): Promise<void> {
    const { device } = this.ctx.entity;

    try {
      await this.password.assert(pin, device.pin.signature);
    } catch (err) {
      throw new InvalidDevicePINError(device.id, err);
    }
  }

  public async encryptSecret(secret: string): Promise<string> {
    return await this.password.encrypt(secret);
  }

  public async assertSecret(secret: string): Promise<void> {
    const { device } = this.ctx.entity;

    try {
      await this.password.assert(secret, device.secret.signature);
    } catch (err) {
      throw new InvalidDeviceSecretError(device.id, err);
    }
  }

  public async generateRecoveryKey(): Promise<string> {
    return (
      `${getRandomValue(4).toUpperCase()}-` +
      `${await getRandomNumber(6)}-` +
      `${getRandomValue(4).toUpperCase()}-` +
      `${await getRandomNumber(6)}-` +
      `${getRandomValue(4).toUpperCase()}`
    );
  }

  public async encryptRecoveryKey(recoveryKey: string): Promise<string> {
    return await this.secret.encrypt(recoveryKey);
  }

  public async assertRecoveryKey(recoveryKey: string): Promise<void> {
    const { device } = this.ctx.entity;

    try {
      await this.secret.assert(recoveryKey, device.recoveryKey.signature);
    } catch (err) {
      throw new InvalidDeviceRecoveryKeyError(device.id);
    }
  }
}
