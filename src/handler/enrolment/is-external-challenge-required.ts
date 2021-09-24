import { Context } from "../../typing";
import { difference, filter } from "lodash";

export const isExternalChallengeRequired = async (
  ctx: Context,
  identityId: string,
): Promise<boolean> => {
  const {
    metadata: {
      agent: { os, platform },
      device: { uniqueId },
    },
    repository: { deviceRepository },
  } = ctx;

  const devices = await deviceRepository.findMany({
    active: true,
    identityId,
    trusted: true,
  });
  const filtered = filter(devices, {
    os,
    platform,
    uniqueId,
  });
  const diff = difference(devices, filtered);

  return diff.length > 0;
};
