import { Enrolment } from "../../entity";
import { IKoaDeviceContext } from "../../typing";
import { config } from "../../config";
import { getExpiryDate } from "../../util";
import { getRandomValue } from "@lindorm-io/core";

interface ICreateEnrolmentOptions {
  accountId: string;
  macAddress: string;
  name: string;
  publicKey: string;
  uniqueId: string;
}

export const createEnrolment = (ctx: IKoaDeviceContext) => async (
  options: ICreateEnrolmentOptions,
): Promise<Enrolment> => {
  const { cache } = ctx;
  const { accountId, macAddress, name, publicKey, uniqueId } = options;

  return await cache.enrolment.create(
    new Enrolment({
      accountId,
      certificateChallenge: getRandomValue(64),
      expires: getExpiryDate(config.ENROLMENT_EXPIRY),
      macAddress,
      name,
      publicKey,
      uniqueId,
    }),
  );
};
