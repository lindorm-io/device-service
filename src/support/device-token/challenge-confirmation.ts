import { Audience, ChallengeScope } from "../../enum";
import { Challenge, Device } from "../../entity";
import { IKoaDeviceContext } from "../../typing";
import { config } from "../../config";

export interface IGetChallengeTokenOptions {
  challenge: Challenge;
  device: Device;
  scope: ChallengeScope;
}

export const getChallengeConfirmationToken = (ctx: IKoaDeviceContext) => (options: IGetChallengeTokenOptions) => {
  const { issuer, logger, metadata } = ctx;
  const { challenge, device, scope } = options;

  logger.debug("creating challenge confirmation token", {
    client: metadata.clientId,
    device: device.id,
    account: device.accountId,
    scope,
  });

  return issuer.device.sign({
    id: challenge.id,
    audience: Audience.CHALLENGE_CONFIRMATION,
    clientId: metadata.clientId,
    deviceId: device.id,
    expiry: config.CHALLENGE_CONFIRMATION_EXPIRY,
    scope: [scope],
    subject: device.accountId,
  });
};
