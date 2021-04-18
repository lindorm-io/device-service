import { IKoaDeviceContext } from "../../typing";

interface IGenerateNewRecoveryKeysData {
  recoveryKey: string;
}

export const generateNewRecoveryKey = (ctx: IKoaDeviceContext) => async (): Promise<IGenerateNewRecoveryKeysData> => {
  const { logger } = ctx;
  const { deviceHandler } = ctx.handler;
  const { deviceRepository } = ctx.repository;
  const { deviceId } = ctx.token.challengeConfirmation;

  const device = await deviceRepository.find({ id: deviceId });

  const createdKey = await deviceHandler.createDeviceRecoveryKey();

  device.recoveryKey = {
    signature: await deviceHandler.encryptRecoveryKey(createdKey),
    updated: new Date(),
  };

  await deviceRepository.update(device);

  logger.debug("device recovery key generated", {
    accountId: device.accountId,
    deviceId: device.id,
  });

  return { recoveryKey: createdKey };
};
