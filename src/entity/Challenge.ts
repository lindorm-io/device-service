import Joi from "joi";
import { ChallengeScope, ChallengeStrategy } from "../enum";
import { EntityAttributes, LindormEntity, EntityOptions, JOI_ENTITY_BASE } from "@lindorm-io/entity";
import { JOI_CERTIFICATE_CHALLENGE, JOI_STRATEGY } from "../constant";

export interface ChallengeAttributes extends EntityAttributes {
  certificateChallenge: string;
  deviceId: string;
  expires: Date;
  scope: ChallengeScope;
  strategy: ChallengeStrategy;
}

export interface ChallengeOptions extends EntityOptions {
  certificateChallenge: string;
  deviceId: string;
  expires: Date;
  scope: ChallengeScope;
  strategy: ChallengeStrategy;
}

const schema = Joi.object({
  ...JOI_ENTITY_BASE,

  certificateChallenge: JOI_CERTIFICATE_CHALLENGE,
  deviceId: Joi.string().guid().required(),
  expires: Joi.date().required(),
  scope: Joi.string().required(),
  strategy: JOI_STRATEGY,
});

export class Challenge extends LindormEntity<ChallengeAttributes> {
  public readonly certificateChallenge: string;
  public readonly deviceId: string;
  public readonly expires: Date;
  public readonly scope: ChallengeScope;
  public readonly strategy: ChallengeStrategy;

  public constructor(options: ChallengeOptions) {
    super(options);

    this.certificateChallenge = options.certificateChallenge;
    this.deviceId = options.deviceId;
    this.expires = options.expires;
    this.scope = options.scope;
    this.strategy = options.strategy;
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

  public toJSON(): ChallengeAttributes {
    return {
      ...this.defaultJSON(),

      certificateChallenge: this.certificateChallenge,
      deviceId: this.deviceId,
      expires: this.expires,
      scope: this.scope,
      strategy: this.strategy,
    };
  }
}
