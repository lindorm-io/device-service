import Joi from "joi";
import { ChallengeStrategy } from "../enum";
import { JOI_CERTIFICATE_CHALLENGE, JOI_STRATEGY } from "../constant";
import {
  EntityAttributes,
  EntityKeys,
  JOI_ENTITY_BASE,
  LindormEntity,
  Optional,
} from "@lindorm-io/entity";

export interface ChallengeSessionAttributes extends EntityAttributes {
  certificateChallenge: string;
  deviceId: string;
  nonce: string;
  payload: Record<string, any>;
  scopes: Array<string>;
  strategies: Array<ChallengeStrategy>;
}

export type ChallengeSessionOptions = Optional<ChallengeSessionAttributes, EntityKeys>;

const schema = Joi.object<ChallengeSessionAttributes>({
  ...JOI_ENTITY_BASE,

  certificateChallenge: JOI_CERTIFICATE_CHALLENGE.required(),
  deviceId: Joi.string().guid().required(),
  nonce: Joi.string().required(),
  payload: Joi.object().required(),
  scopes: Joi.array().items(Joi.string()).required(),
  strategies: Joi.array().items(JOI_STRATEGY).required(),
});

export class ChallengeSession extends LindormEntity<ChallengeSessionAttributes> {
  public readonly certificateChallenge: string;
  public readonly deviceId: string;
  public readonly nonce: string;
  public readonly payload: Record<string, any>;
  public readonly scopes: Array<string>;
  public readonly strategies: Array<ChallengeStrategy>;

  public constructor(options: ChallengeSessionOptions) {
    super(options);

    this.certificateChallenge = options.certificateChallenge;
    this.deviceId = options.deviceId;
    this.nonce = options.nonce;
    this.payload = options.payload;
    this.scopes = options.scopes;
    this.strategies = options.strategies;
  }

  public create(): void {
    /* intentionally left empty */
  }

  public async schemaValidation(): Promise<void> {
    await schema.validateAsync(this.toJSON());
  }

  public toJSON(): ChallengeSessionAttributes {
    return {
      ...this.defaultJSON(),

      certificateChallenge: this.certificateChallenge,
      deviceId: this.deviceId,
      nonce: this.nonce,
      payload: this.payload,
      scopes: this.scopes,
      strategies: this.strategies,
    };
  }
}
