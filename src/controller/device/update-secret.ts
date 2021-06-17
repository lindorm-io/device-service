import Joi from "joi";
import { Controller, ControllerResponse, HttpStatus } from "@lindorm-io/koa";
import { DeviceContext } from "../../typing";
import { JOI_JWT, JOI_SECRET } from "../../constant";
import { assertBearerToDevice, assertChallengeConfirmationToDevice } from "../../util";
import { cryptoLayered } from "../../crypto";

interface RequestBody {
  challengeConfirmationToken: string;
  secret: string;
}

export const deviceUpdateSecretSchema = Joi.object({
  challengeConfirmationToken: JOI_JWT.required(),
  secret: JOI_SECRET.required(),
});

export const deviceUpdateSecret: Controller<DeviceContext<RequestBody>> = async (
  ctx,
): Promise<ControllerResponse<Record<string, never>>> => {
  const {
    entity: { device },
    logger,
    repository: { deviceRepository },
    request: {
      body: { secret },
    },
    token: { bearerToken, challengeConfirmationToken },
  } = ctx;

  logger.debug("device secret change requested", {
    id: device.id,
    accountId: device.accountId,
    secret,
  });

  assertBearerToDevice(bearerToken, device);
  assertChallengeConfirmationToDevice(challengeConfirmationToken, device);

  device.secret = await cryptoLayered.encrypt(secret);

  await deviceRepository.update(device);

  logger.info("device secret change concluded");

  return {
    body: {},
    status: HttpStatus.Success.ACCEPTED,
  };
};
