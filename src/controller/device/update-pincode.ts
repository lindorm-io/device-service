import Joi from "joi";
import { Controller, ControllerResponse, HttpStatus } from "@lindorm-io/koa";
import { DeviceContext } from "../../typing";
import { JOI_JWT, JOI_PINCODE } from "../../constant";
import { assertBearerToDevice, assertChallengeConfirmationToDevice } from "../../util";
import { cryptoLayered } from "../../crypto";

interface RequestBody {
  challengeConfirmationToken: string;
  pincode: string;
}

export const deviceUpdatePincodeSchema = Joi.object({
  challengeConfirmationToken: JOI_JWT.required(),
  pincode: JOI_PINCODE.required(),
});

export const deviceUpdatePincode: Controller<DeviceContext<RequestBody>> = async (
  ctx,
): Promise<ControllerResponse<Record<string, never>>> => {
  const {
    entity: { device },
    logger,
    repository: { deviceRepository },
    request: {
      body: { pincode },
    },
    token: { bearerToken, challengeConfirmationToken },
  } = ctx;

  logger.debug("device pincode change requested", {
    id: device.id,
    accountId: device.accountId,
    pincode,
  });

  assertBearerToDevice(bearerToken, device);
  assertChallengeConfirmationToDevice(challengeConfirmationToken, device);

  device.pincode = await cryptoLayered.encrypt(pincode);

  await deviceRepository.update(device);

  logger.info("device pincode change concluded");

  return {
    body: {},
    status: HttpStatus.Success.ACCEPTED,
  };
};
