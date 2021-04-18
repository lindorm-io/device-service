import { Algorithm, KeyPairHandler } from "@lindorm-io/key-pair";
import { Device, Enrolment } from "../entity";
import { ICreateDeviceFromEnrolmentOptions, ICreateEnrolmentOptions } from "../typing";
import { InvalidCertificateVerifierError } from "../error";
import { KoaDeviceContextAware } from "../class";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { config } from "../config";
import { getExpiryDate } from "../util";
import { getRandomValue } from "@lindorm-io/core";

export class EnrolmentHandler extends KoaDeviceContextAware {
  public async assertEnrolment(enrolmentId: string, certificateVerifier: string): Promise<Enrolment> {
    const { enrolmentCache } = this.ctx.cache;

    const enrolment = await enrolmentCache.find(enrolmentId);

    const handler = new KeyPairHandler({
      algorithm: Algorithm.RS512,
      passphrase: "",
      privateKey: null,
      publicKey: enrolment.publicKey,
    });

    try {
      handler.assert(enrolment.certificateChallenge, certificateVerifier);
    } catch (err) {
      throw new InvalidCertificateVerifierError(enrolment.certificateChallenge, certificateVerifier);
    }

    return enrolment;
  }

  public async createDeviceFromEnrolment(options: ICreateDeviceFromEnrolmentOptions): Promise<Device> {
    const { deviceHandler } = this.ctx.handler;
    const { deviceRepository } = this.ctx.repository;
    const { enrolment, pin, recoveryKey, secret } = options;

    return await deviceRepository.create(
      new Device({
        accountId: enrolment.accountId,
        macAddress: enrolment.macAddress,
        name: enrolment.name,
        pin: { signature: await deviceHandler.encryptDevicePIN(pin), updated: new Date() },
        publicKey: enrolment.publicKey,
        recoveryKey: { signature: await deviceHandler.encryptRecoveryKey(recoveryKey), updated: new Date() },
        secret: secret ? { signature: await deviceHandler.encryptDeviceSecret(secret), updated: new Date() } : null,
        uniqueId: enrolment.uniqueId,
      }),
    );
  }

  public async createEnrolment(options: ICreateEnrolmentOptions): Promise<Enrolment> {
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

  public async removeEnrolledDevice(enrolment: Enrolment): Promise<void> {
    const { deviceRepository } = this.ctx.repository;

    try {
      const device = await deviceRepository.find({
        accountId: enrolment.accountId,
        uniqueId: enrolment.uniqueId,
      });

      await deviceRepository.remove(device);
    } catch (err) {
      if (err instanceof RepositoryEntityNotFoundError) {
        return;
      }

      throw err;
    }
  }
}
