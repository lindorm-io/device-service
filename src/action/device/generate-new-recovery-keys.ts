import { IKoaDeviceContext } from "../../typing";
import { Scope } from "@lindorm-io/jwt";
import { assertScope, createDeviceRecoveryKeys } from "../../support";

interface IGenerateNewRecoveryKeysData {
  recoveryKeys: Array<string>;
}

export const generateNewRecoveryKeys = (ctx: IKoaDeviceContext) => async (): Promise<IGenerateNewRecoveryKeysData> => {
  const { logger, repository, token } = ctx;
  const {
    challengeConfirmation: { deviceId },
  } = token;

  const device = await repository.device.find({ id: deviceId });

  assertScope(ctx)([Scope.EDIT]);

  const { recoveryKeys, signatures } = await createDeviceRecoveryKeys(3);

  device.recoveryKeys = signatures;

  await repository.device.update(device);

  logger.debug("device recovery keys generated", {
    accountId: device.accountId,
    deviceId: device.id,
  });

  return { recoveryKeys };
};
