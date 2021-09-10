import Joi from "joi";
import { CertificateMethod, DeviceEvent } from "../enum";
import { JOI_CERTIFICATE_METHOD, JOI_GUID, JOI_SIGNATURE } from "../constant";
import {
  EntityAttributes,
  EntityCreationError,
  EntityKeys,
  JOI_ENTITY_BASE,
  LindormEntity,
  Optional,
} from "@lindorm-io/entity";

export interface DeviceAttributes extends EntityAttributes {
  biometry: string | null;
  certificateMethod: CertificateMethod;
  identityId: string;
  installationId: string;
  macAddress: string;
  name: string;
  os: string;
  pincode: string | null;
  platform: string;
  publicKey: string;
  uniqueId: string;
}

export type DeviceOptions = Optional<DeviceAttributes, EntityKeys>;

const schema = Joi.object<DeviceAttributes>({
  ...JOI_ENTITY_BASE,

  biometry: JOI_SIGNATURE.allow(null).required(),
  certificateMethod: JOI_CERTIFICATE_METHOD.required(),
  identityId: JOI_GUID.required(),
  installationId: JOI_GUID.required(),
  macAddress: Joi.string().required(),
  name: Joi.string().required(),
  os: Joi.string().required(),
  pincode: JOI_SIGNATURE.allow(null).required(),
  platform: Joi.string().required(),
  publicKey: Joi.string().required(),
  uniqueId: Joi.string().required(),
});

export class Device extends LindormEntity<DeviceAttributes> {
  public readonly certificateMethod: CertificateMethod;
  public readonly identityId: string;
  public readonly installationId: string;
  public readonly macAddress: string;
  public readonly platform: string;
  public readonly publicKey: string;
  public readonly uniqueId: string;

  private _biometry: string | null;
  private _name: string;
  private _os: string;
  private _pincode: string | null;

  public constructor(options: DeviceOptions) {
    super(options);

    this.certificateMethod = options.certificateMethod;
    this.identityId = options.identityId;
    this.installationId = options.installationId;
    this.macAddress = options.macAddress;
    this.platform = options.platform;
    this.publicKey = options.publicKey;
    this.uniqueId = options.uniqueId;

    this._biometry = options.biometry || null;
    this._name = options.name;
    this._os = options.os;
    this._pincode = options.pincode || null;
  }

  public get biometry(): string | null {
    return this._biometry;
  }
  public set biometry(biometry: string | null) {
    this._biometry = biometry;
    this.addEvent(DeviceEvent.BIOMETRY_CHANGED, { biometry });
  }

  public get name(): string {
    return this._name;
  }
  public set name(name: string) {
    this._name = name;
    this.addEvent(DeviceEvent.NAME_CHANGED, { name });
  }

  public get os(): string {
    return this._os;
  }
  public set os(os: string) {
    this._os = os;
    this.addEvent(DeviceEvent.OS_CHANGED, { os });
  }

  public get pincode(): string | null {
    return this._pincode;
  }
  public set pincode(pincode: string | null) {
    this._pincode = pincode;
    this.addEvent(DeviceEvent.PINCODE_CHANGED, { pincode });
  }

  public create(): void {
    for (const evt of this.events) {
      if (evt.name !== DeviceEvent.CREATED) continue;
      throw new EntityCreationError("Device");
    }

    const { events, ...rest } = this.toJSON();
    this.addEvent(DeviceEvent.CREATED, rest);
  }

  public async schemaValidation(): Promise<void> {
    await schema.validateAsync(this.toJSON());
  }

  public toJSON(): DeviceAttributes {
    return {
      ...this.defaultJSON(),

      biometry: this.biometry,
      certificateMethod: this.certificateMethod,
      identityId: this.identityId,
      installationId: this.installationId,
      macAddress: this.macAddress,
      name: this.name,
      os: this.os,
      pincode: this.pincode,
      platform: this.platform,
      publicKey: this.publicKey,
      uniqueId: this.uniqueId,
    };
  }
}
