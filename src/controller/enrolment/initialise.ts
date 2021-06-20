import { Audience } from "../../enum";
import { Controller, ControllerResponse, HttpStatus } from "@lindorm-io/koa";
import { DeviceContext } from "../../typing";
import { EnrolmentSession } from "../../entity";
import { config } from "../../config";
import { getRandomValue } from "@lindorm-io/core";

interface RequestBody {
  macAddress: string;
  name: string;
  publicKey: string;
  uniqueId: string;
}

interface ResponseBody {
  certificateChallenge: string;
  enrolmentSessionToken: string;
  expiresIn: number;
}

export const enrolmentInitialise: Controller<DeviceContext<RequestBody>> = async (
  ctx,
): Promise<ControllerResponse<ResponseBody>> => {
  const {
    cache: { enrolmentSessionCache },
    jwt,
    logger,
    metadata: { clientId },
    request: {
      body: { macAddress, name, publicKey, uniqueId },
    },
    token: { bearerToken },
  } = ctx;

  logger.debug("enrolment session initialisation requested", {
    accountId: bearerToken.subject,
    macAddress,
    name,
    uniqueId,
  });

  const { id, expiresIn, token } = jwt.sign({
    audience: Audience.ENROLMENT_SESSION,
    clientId,
    expiry: config.ENROLMENT_SESSION_EXPIRY,
    subject: bearerToken.subject,
  });

  const enrolmentSession = await enrolmentSessionCache.create(
    new EnrolmentSession({
      id,
      accountId: bearerToken.subject,
      certificateChallenge: getRandomValue(64),
      macAddress,
      name,
      publicKey,
      uniqueId,
    }),
    expiresIn,
  );

  logger.info("enrolment session initialised", {
    id,
    accountId: bearerToken.subject,
    macAddress,
    name,
    uniqueId,
  });

  return {
    body: {
      certificateChallenge: enrolmentSession.certificateChallenge,
      enrolmentSessionToken: token,
      expiresIn,
    },
    status: HttpStatus.Success.OK,
  };
};
