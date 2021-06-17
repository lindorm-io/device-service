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

export interface DeviceAttributes extends EntityAttributes {
  accountId: string;
  macAddress: string;
  name: string;
  pincode: string;
  publicKey: string;
  recoveryKey: string;
  secret: string | null;
  uniqueId: string;
}

export interface DeviceOptions extends EntityOptions {
  accountId: string;
  macAddress: string;
  name: string;
  pincode: string;
  publicKey: string;
  recoveryKey: string;
  secret?: string;
  uniqueId: string;
}

const schema = Joi.object({
  ...JOI_ENTITY_BASE,

  accountId: Joi.string().guid().required(),
  macAddress: Joi.string().required(),
  name: Joi.string().required(),
  pincode: JOI_SIGNATURE.required(),
  publicKey: Joi.string().required(),
  recoveryKey: JOI_SIGNATURE.required(),
  secret: JOI_SIGNATURE.allow(null).required(),
  uniqueId: Joi.string().required(),
});

export class Device extends LindormEntity<DeviceAttributes> {
  public readonly accountId: string;
  public readonly macAddress: string;
  public readonly publicKey: string;
  public readonly uniqueId: string;
  private _name: string;
  private _pincode: string;
  private _recoveryKey: string;
  private _secret: string;

  public constructor(options: DeviceOptions) {
    super(options);

    this.accountId = options.accountId;
    this.macAddress = options.macAddress;
    this.publicKey = options.publicKey;
    this.uniqueId = options.uniqueId;

    this._name = options.name;
    this._pincode = options.pincode;
    this._recoveryKey = options.recoveryKey;
    this._secret = options.secret || null;
  }

  public get name(): string {
    return this._name;
  }
  public set name(name: string) {
    this._name = name;
    this.addEvent(DeviceEvent.NAME_CHANGED, { name: this._name });
  }

  public get pincode(): string {
    return this._pincode;
  }
  public set pincode(pin: string) {
    this._pincode = pin;
    this.addEvent(DeviceEvent.PIN_CHANGED, { pin: this._pincode });
  }

  public get recoveryKey(): string {
    return this._recoveryKey;
  }
  public set recoveryKey(recoveryKey: string) {
    this._recoveryKey = recoveryKey;
    this.addEvent(DeviceEvent.RECOVERY_KEY_CHANGED, { recoveryKey: this._recoveryKey });
  }

  public get secret(): string | null {
    return this._secret;
  }
  public set secret(secret: string | null) {
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
      pincode: this.pincode,
      publicKey: this.publicKey,
      recoveryKey: this.recoveryKey,
      secret: this.secret,
      uniqueId: this.uniqueId,
    };
  }
}
