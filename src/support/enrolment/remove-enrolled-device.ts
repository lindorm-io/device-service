import { IKoaDeviceContext } from "../../typing";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { Enrolment } from "../../entity";

export const removeEnrolledDevice = (ctx: IKoaDeviceContext) => async (enrolment: Enrolment): Promise<void> => {
  const { repository } = ctx;

  try {
    const device = await repository.device.find({
      accountId: enrolment.accountId,
      macAddress: enrolment.macAddress,
      uniqueId: enrolment.uniqueId,
    });

    await repository.device.remove(device);
  } catch (err) {
    if (err instanceof RepositoryEntityNotFoundError) {
      return;
    }

    throw err;
  }
};
