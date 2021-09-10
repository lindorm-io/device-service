import { Context } from "../../typing";

export const updateDeviceMetadata = async (ctx: Context): Promise<void> => {
  const {
    entity: { device },
    logger,
    metadata: {
      agent: { os },
      device: { name },
    },
    repository: { deviceRepository },
  } = ctx;

  try {
    let update = false;

    if (name && name !== device.name) {
      device.name = name;
      update = true;
    }

    if (os && os !== device.os) {
      device.os = os;
      update = true;
    }

    if (update) {
      await deviceRepository.update(device);
    }
  } catch (err) {
    logger.error("Error while updating device metadata", err);
  }
};
