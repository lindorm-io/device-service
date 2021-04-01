import Joi from "@hapi/joi";
import { JOI_STRATEGY } from "../../constant";
import {
  assertChallenge,
  assertDeviceRecoveryKey,
  createDeviceRecoveryKeys,
  getChallengeConfirmationToken,
} from "../../support";
import {
  IKoaDeviceContext,
  IVerifyChallengeWithRecoveryKeyData,
  IVerifyChallengeWithRecoveryKeyOptions,
} from "../../typing";

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  challengeId: Joi.string().guid().required(),
  recoveryKey: Joi.string().required(),
  strategy: JOI_STRATEGY,
});

export const verifyChallengeWithRecoveryKey = (ctx: IKoaDeviceContext) => async (
  options: IVerifyChallengeWithRecoveryKeyOptions,
): Promise<IVerifyChallengeWithRecoveryKeyData> => {
  await schema.validateAsync(options);

  const { device, logger, repository } = ctx;
  const { certificateVerifier, challengeId, recoveryKey, strategy } = options;

  const challenge = await assertChallenge(ctx)({ challengeId, certificateVerifier, strategy });

  await assertDeviceRecoveryKey(device, recoveryKey);

  logger.debug("certificate challenge with recovery key verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });

  const { recoveryKeys, signatures } = await createDeviceRecoveryKeys(3);

  device.recoveryKeys = signatures;

  await repository.device.update(device);

  return {
    challengeConfirmation: getChallengeConfirmationToken(ctx)({ challenge, device }),
    recoveryKeys,
  };
};
