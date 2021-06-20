import { Controller, ControllerResponse, HttpStatus } from "@lindorm-io/koa";
import { DeviceContext } from "../../typing";
import { assertBearerToDevice, assertChallengeConfirmationToDevice } from "../../util";
import { cryptoLayered } from "../../crypto";

interface RequestBody {
  biometry: string;
  challengeConfirmationToken: string;
}

export const deviceUpdateBiometry: Controller<DeviceContext<RequestBody>> = async (
  ctx,
): Promise<ControllerResponse<Record<string, never>>> => {
  const {
    entity: { device },
    logger,
    repository: { deviceRepository },
    request: {
      body: { biometry },
    },
    token: { bearerToken, challengeConfirmationToken },
  } = ctx;

  logger.debug("device biometry change requested", {
    id: device.id,
    accountId: device.accountId,
    biometry,
  });

  assertBearerToDevice(bearerToken, device);
  assertChallengeConfirmationToDevice(challengeConfirmationToken, device);

  device.biometry = await cryptoLayered.encrypt(biometry);

  await deviceRepository.update(device);

  logger.info("device biometry change concluded");

  return {
    body: {},
    status: HttpStatus.Success.OK,
  };
};
