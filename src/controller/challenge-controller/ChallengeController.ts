import { KoaDeviceContextAware } from "../../class";
import {
  IInitialiseChallengeData,
  IInitialiseChallengeOptions,
  IVerifyChallengeData,
  IVerifyChallengeOptions,
  IVerifyChallengeWithPinOptions,
  IVerifyChallengeWithRecoveryKeyData,
  IVerifyChallengeWithRecoveryKeyOptions,
  IVerifyChallengeWithSecretOptions,
} from "../../typing";
import {
  schemaInitialise,
  schemaVerifyImplicit,
  schemaVerifyPin,
  schemaVerifyRecoveryKey,
  schemaVerifySecret,
} from "./schema";

export class ChallengeController extends KoaDeviceContextAware {
  public async initialise(options: IInitialiseChallengeOptions): Promise<IInitialiseChallengeData> {
    const {
      entity: { device },
      handler: { challengeHandler },
      logger,
    } = this.ctx;

    await schemaInitialise.validateAsync(options);
    const { scope, strategy } = options;

    const challenge = await challengeHandler.create(strategy, scope);

    logger.debug("certificate challenge initialised", {
      deviceId: device.id,
    });

    return {
      challengeId: challenge.id,
      certificateChallenge: challenge.certificateChallenge,
      expires: challenge.expires,
    };
  }

  public async verifyImplicit(options: IVerifyChallengeOptions): Promise<IVerifyChallengeData> {
    const {
      entity: { device },
      handler: { challengeHandler },
      logger,
    } = this.ctx;

    await schemaVerifyImplicit.validateAsync(options);
    const { certificateVerifier, strategy } = options;

    await challengeHandler.assert(strategy, certificateVerifier);

    logger.debug("certificate challenge verified", {
      accountId: device.accountId,
      deviceId: device.id,
    });

    return { challengeConfirmation: challengeHandler.getConfirmationToken() };
  }

  public async verifyPin(options: IVerifyChallengeWithPinOptions): Promise<IVerifyChallengeData> {
    const {
      entity: { device },
      handler: { challengeHandler, deviceHandler },
      logger,
    } = this.ctx;

    await schemaVerifyPin.validateAsync(options);
    const { certificateVerifier, pin, strategy } = options;

    await challengeHandler.assert(strategy, certificateVerifier);
    await deviceHandler.assertPin(pin);

    logger.debug("certificate challenge with pin verified", {
      accountId: device.accountId,
      deviceId: device.id,
    });

    return { challengeConfirmation: challengeHandler.getConfirmationToken() };
  }

  public async verifyRecoveryKey(
    options: IVerifyChallengeWithRecoveryKeyOptions,
  ): Promise<IVerifyChallengeWithRecoveryKeyData> {
    const {
      entity: { device },
      handler: { challengeHandler, deviceHandler },
      logger,
      repository: { deviceRepository },
    } = this.ctx;

    await schemaVerifyRecoveryKey.validateAsync(options);
    const { certificateVerifier, recoveryKey, strategy } = options;

    await challengeHandler.assert(strategy, certificateVerifier);
    await deviceHandler.assertRecoveryKey(recoveryKey);

    logger.debug("certificate challenge with recovery key verified", {
      accountId: device.accountId,
      deviceId: device.id,
    });

    const createdKey = await deviceHandler.generateRecoveryKey();

    device.recoveryKey = {
      signature: await deviceHandler.encryptRecoveryKey(createdKey),
      updated: new Date(),
    };

    await deviceRepository.update(device);

    return {
      challengeConfirmation: challengeHandler.getConfirmationToken(),
      recoveryKey: createdKey,
    };
  }

  public async verifySecret(options: IVerifyChallengeWithSecretOptions): Promise<IVerifyChallengeData> {
    const {
      entity: { device },
      handler: { challengeHandler, deviceHandler },
      logger,
    } = this.ctx;

    await schemaVerifySecret.validateAsync(options);
    const { certificateVerifier, secret, strategy } = options;

    await challengeHandler.assert(strategy, certificateVerifier);
    await deviceHandler.assertSecret(secret);

    logger.debug("certificate challenge with secret verified", {
      accountId: device.accountId,
      deviceId: device.id,
    });

    return { challengeConfirmation: challengeHandler.getConfirmationToken() };
  }
}
