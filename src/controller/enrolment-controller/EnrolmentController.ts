import { DeviceContextAware } from "../../class";
import { schemaInitialise, schemaVerify } from "./schema";
import {
  IConcludeEnrolmentData,
  IConcludeEnrolmentOptions,
  IInitialiseEnrolmentData,
  IInitialiseEnrolmentOptions,
} from "../../typing";

export class EnrolmentController extends DeviceContextAware {
  public async initialise(options: IInitialiseEnrolmentOptions): Promise<IInitialiseEnrolmentData> {
    const {
      handler: { enrolmentHandler },
      logger,
      token: {
        bearer: { subject: accountId },
      },
    } = this.ctx;

    await schemaInitialise.validateAsync(options);
    const { macAddress, name, publicKey, uniqueId } = options;

    const enrolment = await enrolmentHandler.create({
      accountId,
      macAddress,
      name,
      publicKey,
      uniqueId,
    });

    logger.debug("enrolment initialised", {
      enrolmentId: enrolment.id,
    });

    return {
      certificateChallenge: enrolment.certificateChallenge,
      enrolmentId: enrolment.id,
      expires: enrolment.expires,
    };
  }

  public async verify(options: IConcludeEnrolmentOptions): Promise<IConcludeEnrolmentData> {
    const {
      cache: { enrolmentCache },
      handler: { enrolmentHandler, deviceHandler },
      logger,
    } = this.ctx;

    await schemaVerify.validateAsync(options);
    const { certificateVerifier, enrolmentId, pin, secret } = options;

    const enrolment = await enrolmentHandler.assert(enrolmentId, certificateVerifier);
    await enrolmentHandler.removeDevice(enrolment);

    const recoveryKey = await deviceHandler.generateRecoveryKey();

    const device = await enrolmentHandler.createDevice({
      enrolment,
      pin,
      recoveryKey,
      secret,
    });

    logger.debug("enrolment verified", {
      deviceId: device.id,
    });

    await enrolmentCache.remove(enrolment);

    return { deviceId: device.id, recoveryKey };
  }
}
