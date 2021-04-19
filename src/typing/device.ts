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
  pin: string;
}

export interface IChangeDeviceSecretOptions {
  secret: string;
}
