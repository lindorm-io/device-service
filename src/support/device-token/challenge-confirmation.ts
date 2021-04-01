import { Audience } from "../../enum";
import { IKoaDeviceContext } from "../../typing";
import { config } from "../../config";

export const getChallengeConfirmationToken = (ctx: IKoaDeviceContext) => () => {
  const { challenge, device, issuer, logger, metadata } = ctx;

  logger.debug("creating challenge confirmation token", {
    client: metadata.clientId,
    device: device.id,
    account: device.accountId,
    scope: challenge.scope,
  });

  return issuer.device.sign({
    id: challenge.id,
    audience: Audience.CHALLENGE_CONFIRMATION,
    clientId: metadata.clientId,
    deviceId: device.id,
    expiry: config.CHALLENGE_CONFIRMATION_EXPIRY,
    scope: [challenge.scope],
    subject: device.accountId,
  });
};
