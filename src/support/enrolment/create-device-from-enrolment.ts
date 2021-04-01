import { Device, Enrolment } from "../../entity";
import { IKoaDeviceContext } from "../../typing";
import { encryptDevicePIN, encryptDeviceSecret } from "../device";

interface ICreateDeviceFromEnrolmentOptions {
  enrolment: Enrolment;
  pin: string;
  recoveryKeys?: Array<string>;
  secret?: string;
}

export const createDeviceFromEnrolment = (ctx: IKoaDeviceContext) => async (
  options: ICreateDeviceFromEnrolmentOptions,
): Promise<Device> => {
  const { repository } = ctx;
  const { enrolment, pin, recoveryKeys, secret } = options;

  return await repository.device.create(
    new Device({
      accountId: enrolment.accountId,
      macAddress: enrolment.macAddress,
      name: enrolment.name,
      pin: { signature: await encryptDevicePIN(pin), updated: new Date() },
      publicKey: enrolment.publicKey,
      recoveryKeys: recoveryKeys || [],
      secret: secret ? { signature: await encryptDeviceSecret(secret), updated: new Date() } : null,
      uniqueId: enrolment.uniqueId,
    }),
  );
};
