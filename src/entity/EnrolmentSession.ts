import Joi from "joi";
import { EntityAttributes, LindormEntity, EntityOptions, JOI_ENTITY_BASE } from "@lindorm-io/entity";
import { JOI_CERTIFICATE_CHALLENGE } from "../constant";

export interface EnrolmentSessionAttributes extends EntityAttributes {
  accountId: string;
  certificateChallenge: string;
  macAddress: string;
  name: string;
  publicKey: string;
  uniqueId: string;
}

export interface EnrolmentSessionOptions extends EntityOptions {
  accountId: string;
  certificateChallenge: string;
  macAddress: string;
  name: string;
  publicKey: string;
  uniqueId: string;
}

const schema = Joi.object({
  ...JOI_ENTITY_BASE,

  accountId: Joi.string().guid().required(),
  certificateChallenge: JOI_CERTIFICATE_CHALLENGE,
  macAddress: Joi.string().required(),
  name: Joi.string().required(),
  publicKey: Joi.string().required(),
  uniqueId: Joi.string().required(),
});

export class EnrolmentSession extends LindormEntity<EnrolmentSessionAttributes> {
  public readonly accountId: string;
  public readonly certificateChallenge: string;
  public readonly macAddress: string;
  public readonly name: string;
  public readonly publicKey: string;
  public readonly uniqueId: string;

  public constructor(options: EnrolmentSessionOptions) {
    super(options);

    this.accountId = options.accountId;
    this.certificateChallenge = options.certificateChallenge;
    this.macAddress = options.macAddress;
    this.name = options.name;
    this.publicKey = options.publicKey;
    this.uniqueId = options.uniqueId;
  }

  public create(): void {
    /* intentionally left empty */
  }

  public getKey(): string {
    return this.id;
  }

  public async schemaValidation(): Promise<void> {
    await schema.validateAsync(this.toJSON());
  }

  public toJSON(): EnrolmentSessionAttributes {
    return {
      ...this.defaultJSON(),

      accountId: this.accountId,
      certificateChallenge: this.certificateChallenge,
      macAddress: this.macAddress,
      name: this.name,
      publicKey: this.publicKey,
      uniqueId: this.uniqueId,
    };
  }
}
