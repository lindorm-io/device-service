import Joi from "@hapi/joi";
import { JOI_STRATEGY } from "../../constant";
import {
  IKoaDeviceContext,
  IVerifyChallengeWithRecoveryKeyData,
  IVerifyChallengeWithRecoveryKeyOptions,
} from "../../typing";

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  recoveryKey: Joi.string().required(),
  strategy: JOI_STRATEGY,
});

export const verifyChallengeWithRecoveryKey = (ctx: IKoaDeviceContext) => async (
  options: IVerifyChallengeWithRecoveryKeyOptions,
): Promise<IVerifyChallengeWithRecoveryKeyData> => {
  await schema.validateAsync(options);

  const { logger } = ctx;
  const { device } = ctx.entity;
  const { challengeHandler, deviceHandler } = ctx.handler;
  const { deviceRepository } = ctx.repository;
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
};
