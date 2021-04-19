export interface IGetDevicesOptions {
  accountId: string;
}

export interface IDeviceData {
  deviceId: string;
  macAddress: string;
  name: string;
  uniqueId: string;
}

export interface IGetDevicesData {
  devices: Array<IDeviceData>;
}
