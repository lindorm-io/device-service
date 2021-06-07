import { CryptoLayered, CryptoSecret } from "@lindorm-io/crypto";
import { DeviceContext } from "../typing";
import { DeviceContextAware } from "../class";
import { config } from "../config";
import { getRandomValue } from "@lindorm-io/core";
import { ClientError } from "@lindorm-io/errors";

export class DeviceHandler extends DeviceContextAware {
  private readonly layered: CryptoLayered;
  private readonly secret: CryptoSecret;

  public constructor(ctx: DeviceContext) {
    super(ctx);

    this.layered = new CryptoLayered({
      aes: { secret: config.CRYPTO_AES_SECRET },
      sha: { secret: config.CRYPTO_SHA_SECRET },
    });

    this.secret = new CryptoSecret({
      aes: { secret: config.CRYPTO_AES_SECRET },
      sha: { secret: config.CRYPTO_SHA_SECRET },
    });
  }

  public async encryptPin(pin: string): Promise<string> {
    return await this.layered.encrypt(pin);
  }

  public async assertPin(pin: string): Promise<void> {
    const { device } = this.ctx.entity;

    try {
      await this.layered.assert(pin, device.pin.signature);
    } catch (err) {
      throw new ClientError("Forbidden", {
        debug: { deviceId: device.id },
        error: err,
        statusCode: ClientError.StatusCode.CONFLICT,
      });
    }
  }

  public async encryptSecret(secret: string): Promise<string> {
    return await this.layered.encrypt(secret);
  }

  public async assertSecret(secret: string): Promise<void> {
    const { device } = this.ctx.entity;

    try {
      await this.layered.assert(secret, device.secret.signature);
    } catch (err) {
      throw new ClientError("Forbidden", {
        debug: { deviceId: device.id },
        error: err,
        statusCode: ClientError.StatusCode.CONFLICT,
      });
    }
  }

  public async generateRecoveryKey(): Promise<string> {
    return (
      `${getRandomValue(5).toUpperCase()}-` +
      `${getRandomValue(5).toUpperCase()}-` +
      `${getRandomValue(5).toUpperCase()}-` +
      `${getRandomValue(5).toUpperCase()}-` +
      `${getRandomValue(5).toUpperCase()}-` +
      `${getRandomValue(5).toUpperCase()}`
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
      throw new ClientError("Forbidden", {
        debug: { deviceId: device.id },
        error: err,
        statusCode: ClientError.StatusCode.CONFLICT,
      });
    }
  }
}
