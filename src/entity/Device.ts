import Joi from "joi";
import { DeviceEvent } from "../enum";
import { JOI_SIGNATURE } from "../constant";
import {
  EntityAttributes,
  EntityCreationError,
  EntityOptions,
  JOI_ENTITY_BASE,
  LindormEntity,
} from "@lindorm-io/entity";

export interface Signature {
  signature: string | null;
  updated: Date | null;
}

export interface DeviceAttributes extends EntityAttributes {
  accountId: string;
  macAddress: string;
  name: string;
  pin: Signature;
  publicKey: string;
  recoveryKey: Signature;
  secret: Signature;
  uniqueId: string;
}

export interface DeviceOptions extends EntityOptions {
  accountId: string;
  macAddress: string;
  name: string;
  pin?: Signature;
  publicKey: string;
  recoveryKey?: Signature;
  secret?: Signature;
  uniqueId: string;
}

const schema = Joi.object({
  ...JOI_ENTITY_BASE,

  accountId: Joi.string().guid().required(),
  macAddress: Joi.string().required(),
  name: Joi.string().required(),
  pin: JOI_SIGNATURE,
  publicKey: Joi.string().required(),
  recoveryKey: JOI_SIGNATURE,
  secret: JOI_SIGNATURE,
  uniqueId: Joi.string().required(),
});

export class Device extends LindormEntity<DeviceAttributes> {
  public readonly accountId: string;
  public readonly macAddress: string;
  public readonly publicKey: string;
  public readonly uniqueId: string;
  private _name: string;
  private _pin: Signature;
  private _recoveryKey: Signature;
  private _secret: Signature;

  public constructor(options: DeviceOptions) {
    super(options);

    this.accountId = options.accountId;
    this.macAddress = options.macAddress;
    this.publicKey = options.publicKey;
    this.uniqueId = options.uniqueId;

    this._name = options.name;
    this._pin = {
      signature: options.pin?.signature || null,
      updated: options.pin?.updated || null,
    };
    this._recoveryKey = {
      signature: options.recoveryKey?.signature || null,
      updated: options.recoveryKey?.updated || null,
    };
    this._secret = {
      signature: options.secret?.signature || null,
      updated: options.secret?.updated || null,
    };
  }

  public get name(): string {
    return this._name;
  }
  public set name(name: string) {
    this._name = name;
    this.addEvent(DeviceEvent.NAME_CHANGED, { name: this._name });
  }

  public get pin(): Signature {
    return this._pin;
  }
  public set pin(pin: Signature) {
    this._pin = pin;
    this.addEvent(DeviceEvent.PIN_CHANGED, { pin: this._pin });
  }

  public get recoveryKey(): Signature {
    return this._recoveryKey;
  }
  public set recoveryKey(recoveryKey: Signature) {
    this._recoveryKey = recoveryKey;
    this.addEvent(DeviceEvent.RECOVERY_KEY_CHANGED, { recoveryKey: this._recoveryKey });
  }

  public get secret(): Signature {
    return this._secret;
  }
  public set secret(secret: Signature) {
    this._secret = secret;
    this.addEvent(DeviceEvent.SECRET_CHANGED, { secret: this._secret });
  }

  public create(): void {
    for (const evt of this.events) {
      if (evt.name !== DeviceEvent.CREATED) continue;
      throw new EntityCreationError("Device");
    }

    const { events, ...rest } = this.toJSON();
    this.addEvent(DeviceEvent.CREATED, rest);
  }

  public getKey(): string {
    return this.id;
  }

  public async schemaValidation(): Promise<void> {
    await schema.validateAsync(this.toJSON());
  }

  public toJSON(): DeviceAttributes {
    return {
      ...this.defaultJSON(),

      accountId: this.accountId,
      macAddress: this.macAddress,
      name: this.name,
      pin: this.pin,
      publicKey: this.publicKey,
      recoveryKey: this.recoveryKey,
      secret: this.secret,
      uniqueId: this.uniqueId,
    };
  }
}
