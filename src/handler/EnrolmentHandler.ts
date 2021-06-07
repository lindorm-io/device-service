import { Algorithm } from "@lindorm-io/key-pair";
import { ClientError } from "@lindorm-io/errors";
import { CryptoKeyPair } from "@lindorm-io/crypto";
import { Device, Enrolment } from "../entity";
import { DeviceContextAware } from "../class";
import { ICreateDeviceFromEnrolmentOptions, ICreateEnrolmentOptions } from "../typing";
import { config } from "../config";
import { getExpiryDate } from "../util";
import { getRandomValue } from "@lindorm-io/core";
import { EntityNotFoundError } from "@lindorm-io/mongo";

export class EnrolmentHandler extends DeviceContextAware {
  public async create(options: ICreateEnrolmentOptions): Promise<Enrolment> {
    const { enrolmentCache } = this.ctx.cache;
    const { accountId, macAddress, name, publicKey, uniqueId } = options;

    return await enrolmentCache.create(
      new Enrolment({
        accountId,
        certificateChallenge: getRandomValue(64),
        expires: getExpiryDate(config.ENROLMENT_EXPIRY),
        macAddress,
        name,
        publicKey,
        uniqueId,
      }),
    );
  }

  public async assert(enrolmentId: string, certificateVerifier: string): Promise<Enrolment> {
    const { enrolmentCache } = this.ctx.cache;

    const enrolment = await enrolmentCache.find(enrolmentId);

    const handler = new CryptoKeyPair({
      algorithm: Algorithm.RS512,
      passphrase: "",
      privateKey: null,
      publicKey: enrolment.publicKey,
    });

    try {
      handler.assert(enrolment.certificateChallenge, certificateVerifier);
    } catch (err) {
      throw new ClientError("Invalid Certificate Challenge", {
        debug: { certificateChallenge: enrolment.certificateChallenge, certificateVerifier },
        statusCode: ClientError.StatusCode.FORBIDDEN,
      });
    }

    return enrolment;
  }

  public async createDevice(options: ICreateDeviceFromEnrolmentOptions): Promise<Device> {
    const { deviceHandler } = this.ctx.handler;
    const { deviceRepository } = this.ctx.repository;
    const { enrolment, pin, recoveryKey, secret } = options;

    return await deviceRepository.create(
      new Device({
        accountId: enrolment.accountId,
        macAddress: enrolment.macAddress,
        name: enrolment.name,
        pin: { signature: await deviceHandler.encryptPin(pin), updated: new Date() },
        publicKey: enrolment.publicKey,
        recoveryKey: { signature: await deviceHandler.encryptRecoveryKey(recoveryKey), updated: new Date() },
        secret: secret ? { signature: await deviceHandler.encryptSecret(secret), updated: new Date() } : null,
        uniqueId: enrolment.uniqueId,
      }),
    );
  }

  public async removeDevice(enrolment: Enrolment): Promise<void> {
    const { deviceRepository } = this.ctx.repository;

    try {
      const device = await deviceRepository.find({
        accountId: enrolment.accountId,
        uniqueId: enrolment.uniqueId,
      });

      await deviceRepository.remove(device);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        return;
      }

      throw err;
    }
  }
}
