import { IKoaDeviceContext } from "../../typing";
import { Enrolment } from "../../entity";
import { getRandomValue } from "@lindorm-io/core";
import { getExpiryDate } from "../../util";
import { ENROLMENT_EXPIRY } from "../../config";

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
      expires: getExpiryDate(ENROLMENT_EXPIRY),
      macAddress,
      name,
      publicKey,
      uniqueId,
    }),
  );
};
