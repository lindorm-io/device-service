export interface IGenerateNewRecoveryKeysOptions {
  deviceId: string;
}

export interface IGenerateNewRecoveryKeysData {
  recoveryKey: string;
}

export interface IRemoveDeviceOptions {
  deviceId: string;
}

export interface IUpdateDeviceName {
  deviceId: string;
  name: string;
}

export interface IUpdateDevicePinOptions {
  deviceId: string;
  pin: string;
}

export interface IChangeDeviceSecretOptions {
  deviceId: string;
  secret: string;
}
