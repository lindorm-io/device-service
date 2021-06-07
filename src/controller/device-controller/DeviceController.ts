import { DeviceContextAware } from "../../class";
import { Scope } from "@lindorm-io/jwt";
import { schemaRemove, schemaUpdateName, schemaUpdatePin, schemaUpdateSecret } from "./schema";
import {
  IChangeDeviceSecretOptions,
  IGenerateNewRecoveryKeysData,
  IGenerateNewRecoveryKeysOptions,
  IRemoveDeviceOptions,
  IUpdateDeviceName,
  IUpdateDevicePinOptions,
} from "../../typing";

export class DeviceController extends DeviceContextAware {
  public async generateRecoveryKey(options: IGenerateNewRecoveryKeysOptions): Promise<IGenerateNewRecoveryKeysData> {
    const {
      handler: { deviceHandler },
      logger,
      repository: { deviceRepository },
      token: {
        challengeConfirmation: { deviceId },
      },
    } = this.ctx;

    const device = await deviceRepository.find({ id: deviceId });

    const createdKey = await deviceHandler.generateRecoveryKey();

    device.recoveryKey = {
      signature: await deviceHandler.encryptRecoveryKey(createdKey),
      updated: new Date(),
    };

    await deviceRepository.update(device);

    logger.debug("device recovery key generated", {
      accountId: device.accountId,
      deviceId: device.id,
    });

    return { recoveryKey: createdKey };
  }

  public async updateName(options: IUpdateDeviceName): Promise<void> {
    const {
      handler: { authTokenHandler },
      logger,
      repository: { deviceRepository },
    } = this.ctx;

    await schemaUpdateName.validateAsync(options);
    const { deviceId, name } = options;

    const device = await deviceRepository.find({ id: deviceId });

    authTokenHandler.assertPermission(device.accountId);
    authTokenHandler.assertScope([Scope.EDIT]);

    device.name = name;

    await deviceRepository.update(device);

    logger.debug("device updated", {
      accountId: device.accountId,
      deviceId: device.id,
    });
  }

  public async updatePin(options: IUpdateDevicePinOptions): Promise<void> {
    const {
      handler: { authTokenHandler, deviceHandler },
      logger,
      repository: { deviceRepository },
      token: {
        challengeConfirmation: { deviceId },
      },
    } = this.ctx;

    await schemaUpdatePin.validateAsync(options);
    const { pin } = options;

    const device = await deviceRepository.find({ id: deviceId });

    authTokenHandler.assertScope([Scope.EDIT]);

    device.pin = {
      signature: await deviceHandler.encryptPin(pin),
      updated: new Date(),
    };

    await deviceRepository.update(device);

    logger.debug("device pin updated", {
      accountId: device.accountId,
      deviceId: device.id,
    });
  }

  public async updateSecret(options: IChangeDeviceSecretOptions): Promise<void> {
    const {
      handler: { authTokenHandler, deviceHandler },
      logger,
      repository: { deviceRepository },
      token: {
        challengeConfirmation: { deviceId },
      },
    } = this.ctx;

    await schemaUpdateSecret.validateAsync(options);
    const { secret } = options;

    const device = await deviceRepository.find({ id: deviceId });

    authTokenHandler.assertScope([Scope.EDIT]);

    device.secret = {
      signature: await deviceHandler.encryptSecret(secret),
      updated: new Date(),
    };

    await deviceRepository.update(device);

    logger.debug("device secret updated", {
      accountId: device.accountId,
      deviceId: device.id,
    });
  }

  public async remove(options: IRemoveDeviceOptions): Promise<void> {
    const {
      handler: { authTokenHandler },
      logger,
      repository: { deviceRepository },
    } = this.ctx;

    await schemaRemove.validateAsync(options);
    const { deviceId } = options;

    const device = await deviceRepository.find({ id: deviceId });

    authTokenHandler.assertPermission(device.accountId);
    authTokenHandler.assertScope([Scope.EDIT]);

    await deviceRepository.remove(device);

    logger.debug("device removed", {
      accountId: device.accountId,
      deviceId: device.id,
    });
  }
}
