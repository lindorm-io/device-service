import Joi from "joi";
import { CertificateMethod } from "../enum";
import { JOI_CERTIFICATE_CHALLENGE, JOI_CERTIFICATE_METHOD } from "../constant";
import {
  EntityAttributes,
  LindormEntity,
  JOI_ENTITY_BASE,
  Optional,
  EntityKeys,
} from "@lindorm-io/entity";

export interface EnrolmentSessionAttributes extends EntityAttributes {
  certificateChallenge: string;
  certificateMethod: CertificateMethod;
  externalChallengeRequired: boolean;
  identityId: string;
  installationId: string;
  macAddress: string;
  name: string;
  nonce: string;
  os: string;
  platform: string;
  publicKey: string;
  uniqueId: string;
}

export type EnrolmentSessionOptions = Optional<EnrolmentSessionAttributes, EntityKeys>;

const schema = Joi.object({
  ...JOI_ENTITY_BASE,

  certificateChallenge: JOI_CERTIFICATE_CHALLENGE.required(),
  certificateMethod: JOI_CERTIFICATE_METHOD.required(),
  externalChallengeRequired: Joi.boolean().required(),
  identityId: Joi.string().guid().required(),
  installationId: Joi.string().guid().required(),
  macAddress: Joi.string().required(),
  name: Joi.string().required(),
  nonce: Joi.string().required(),
  os: Joi.string().required(),
  platform: Joi.string().required(),
  publicKey: Joi.string().required(),
  uniqueId: Joi.string().required(),
});

export class EnrolmentSession extends LindormEntity<EnrolmentSessionAttributes> {
  public readonly certificateChallenge: string;
  public readonly certificateMethod: CertificateMethod;
  public readonly externalChallengeRequired: boolean;
  public readonly identityId: string;
  public readonly installationId: string;
  public readonly macAddress: string;
  public readonly name: string;
  public readonly nonce: string;
  public readonly os: string;
  public readonly platform: string;
  public readonly publicKey: string;
  public readonly uniqueId: string;

  public constructor(options: EnrolmentSessionOptions) {
    super(options);

    this.certificateChallenge = options.certificateChallenge;
    this.certificateMethod = options.certificateMethod;
    this.externalChallengeRequired = options.externalChallengeRequired;
    this.identityId = options.identityId;
    this.installationId = options.installationId;
    this.macAddress = options.macAddress;
    this.name = options.name;
    this.nonce = options.nonce;
    this.os = options.os;
    this.platform = options.platform;
    this.publicKey = options.publicKey;
    this.uniqueId = options.uniqueId;
  }

  public create(): void {
    /* intentionally left empty */
  }

  public async schemaValidation(): Promise<void> {
    await schema.validateAsync(this.toJSON());
  }

  public toJSON(): EnrolmentSessionAttributes {
    return {
      ...this.defaultJSON(),

      certificateChallenge: this.certificateChallenge,
      certificateMethod: this.certificateMethod,
      externalChallengeRequired: this.externalChallengeRequired,
      identityId: this.identityId,
      installationId: this.installationId,
      macAddress: this.macAddress,
      name: this.name,
      nonce: this.nonce,
      os: this.os,
      platform: this.platform,
      publicKey: this.publicKey,
      uniqueId: this.uniqueId,
    };
  }
}
