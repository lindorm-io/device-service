import { Controller, ControllerResponse, HttpStatus } from "@lindorm-io/koa";
import { DeviceContext } from "../../typing";
import { assertBearerToDevice, assertChallengeConfirmationToDevice, generateRecoveryKey } from "../../util";
import { cryptoLayered } from "../../crypto";

interface RequestBody {
  challengeConfirmationToken: string;
}

interface ResponseBody {
  recoveryKey: string;
}

export const deviceUpdateRecoveryKey: Controller<DeviceContext<RequestBody>> = async (
  ctx,
): Promise<ControllerResponse<ResponseBody>> => {
  const {
    entity: { device },
    logger,
    repository: { deviceRepository },
    token: { bearerToken, challengeConfirmationToken },
  } = ctx;

  logger.debug("device recovery key requested", {
    id: device.id,
    accountId: device.accountId,
  });

  assertBearerToDevice(bearerToken, device);
  assertChallengeConfirmationToDevice(challengeConfirmationToken, device);

  const recoveryKey = generateRecoveryKey();

  device.recoveryKey = await cryptoLayered.encrypt(recoveryKey);

  await deviceRepository.update(device);

  logger.info("device recovery key generated");

  return {
    body: {
      recoveryKey,
    },
    status: HttpStatus.Success.OK,
  };
};
