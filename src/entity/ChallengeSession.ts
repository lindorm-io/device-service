import Joi from "joi";
import { ChallengeStrategy } from "../enum";
import { EntityAttributes, LindormEntity, EntityOptions, JOI_ENTITY_BASE } from "@lindorm-io/entity";
import { JOI_CERTIFICATE_CHALLENGE, JOI_STRATEGY } from "../constant";

export interface ChallengeSessionAttributes extends EntityAttributes {
  certificateChallenge: string;
  deviceId: string;
  scope: Array<string>;
  strategies: Array<ChallengeStrategy>;
}

export interface ChallengeSessionOptions extends EntityOptions {
  certificateChallenge: string;
  deviceId: string;
  scope: Array<string>;
  strategies: Array<ChallengeStrategy>;
}

const schema = Joi.object({
  ...JOI_ENTITY_BASE,

  certificateChallenge: JOI_CERTIFICATE_CHALLENGE.required(),
  deviceId: Joi.string().guid().required(),
  scope: Joi.array().items(Joi.string()).required(),
  strategies: Joi.array().items(JOI_STRATEGY).required(),
});

export class ChallengeSession extends LindormEntity<ChallengeSessionAttributes> {
  public readonly certificateChallenge: string;
  public readonly deviceId: string;
  public readonly scope: Array<string>;
  public readonly strategies: Array<ChallengeStrategy>;

  public constructor(options: ChallengeSessionOptions) {
    super(options);

    this.certificateChallenge = options.certificateChallenge;
    this.deviceId = options.deviceId;
    this.scope = options.scope;
    this.strategies = options.strategies;
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

  public toJSON(): ChallengeSessionAttributes {
    return {
      ...this.defaultJSON(),

      certificateChallenge: this.certificateChallenge,
      deviceId: this.deviceId,
      scope: this.scope,
      strategies: this.strategies,
    };
  }
}
