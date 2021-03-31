import { ChallengeScope, ChallengeStrategy } from "../enum";
import { EntityBase, IEntity, IEntityBaseOptions } from "@lindorm-io/entity";

export interface IChallenge extends IEntity {
  certificateChallenge: string;
  deviceId: string;
  expires: Date;
  scope: ChallengeScope;
  strategy: ChallengeStrategy;
}

export interface IChallengeOptions extends IEntityBaseOptions {
  certificateChallenge: string;
  deviceId: string;
  expires: Date;
  scope: ChallengeScope;
  strategy: ChallengeStrategy;
}

export class Challenge extends EntityBase implements IChallenge {
  readonly certificateChallenge: string;
  readonly deviceId: string;
  readonly expires: Date;
  readonly scope: ChallengeScope;
  readonly strategy: ChallengeStrategy;

  constructor(options: IChallengeOptions) {
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
}
