import { DeviceEvent } from "../enum";
import { EntityBase, EntityCreationError, IEntity, IEntityBaseOptions } from "@lindorm-io/entity";

export interface IEncryptedData {
  signature: string;
  updated: Date;
}

export interface IDevice extends IEntity {
  accountId: string;
  macAddress: string;
  name: string;
  pin: IEncryptedData;
  publicKey: string;
  recoveryKey: IEncryptedData;
  secret: IEncryptedData;
  uniqueId: string;
}

export interface IDeviceOptions extends IEntityBaseOptions {
  accountId: string;
  macAddress?: string;
  name?: string;
  pin?: IEncryptedData;
  publicKey: string;
  recoveryKey?: IEncryptedData;
  secret?: IEncryptedData;
  uniqueId?: string;
}

export class Device extends EntityBase implements IDevice {
  private _accountId: string;
  private _macAddress: string;
  private _name: string;
  private _pin: IEncryptedData;
  private _publicKey: string;
  private _recoveryKey: IEncryptedData;
  private _secret: IEncryptedData;
  private _uniqueId: string;

  constructor(options: IDeviceOptions) {
    super(options);
    this._accountId = options.accountId;
    this._macAddress = options.macAddress || null;
    this._name = options.name || null;
    this._pin = {
      signature: options.pin?.signature || null,
      updated: options.pin?.updated || null,
    };
    this._publicKey = options.publicKey;
    this._recoveryKey = {
      signature: options.recoveryKey?.signature || null,
      updated: options.recoveryKey?.updated || null,
    };
    this._secret = {
      signature: options.secret?.signature || null,
      updated: options.secret?.updated || null,
    };
    this._uniqueId = options.uniqueId || null;
  }

  public get accountId(): string {
    return this._accountId;
  }

  public get macAddress(): string {
    return this._macAddress;
  }
  public set macAddress(macAddress: string) {
    this._macAddress = macAddress;
    this.addEvent(DeviceEvent.MAC_ADDRESS_CHANGED, { macAddress: this._macAddress });
  }

  public get name(): string {
    return this._name;
  }
  public set name(name: string) {
    this._name = name;
    this.addEvent(DeviceEvent.NAME_CHANGED, { name: this._name });
  }

  public get pin(): IEncryptedData {
    return this._pin;
  }
  public set pin(pin: IEncryptedData) {
    this._pin = pin;
    this.addEvent(DeviceEvent.PIN_CHANGED, { pin: this._pin });
  }

  public get publicKey(): string {
    return this._publicKey;
  }

  public get recoveryKey(): IEncryptedData {
    return this._recoveryKey;
  }
  public set recoveryKey(recoveryKey: IEncryptedData) {
    this._recoveryKey = recoveryKey;
    this.addEvent(DeviceEvent.RECOVERY_KEY_CHANGED, { recoveryKey: this._recoveryKey });
  }

  public get secret(): IEncryptedData {
    return this._secret;
  }
  public set secret(secret: IEncryptedData) {
    this._secret = secret;
    this.addEvent(DeviceEvent.SECRET_CHANGED, { secret: this._secret });
  }

  public get uniqueId(): string {
    return this._uniqueId;
  }
  public set uniqueId(uniqueId: string) {
    this._uniqueId = uniqueId;
    this.addEvent(DeviceEvent.UNIQUE_ID_CHANGED, { uniqueId: this._uniqueId });
  }

  public create(): void {
    for (const evt of this._events) {
      if (evt.name !== DeviceEvent.CREATED) continue;
      throw new EntityCreationError("Device");
    }
    this.addEvent(DeviceEvent.CREATED, {
      accountId: this._accountId,
      macAddress: this._macAddress,
      name: this._name,
      pin: this._pin,
      publicKey: this._publicKey,
      recoveryKey: this._recoveryKey,
      secret: this._secret,
      created: this._created,
      updated: this._updated,
    });
  }
}
