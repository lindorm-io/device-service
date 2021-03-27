import { EntityBase, IEntity, IEntityBaseOptions } from "@lindorm-io/entity";

export interface IEnrolment extends IEntity {
  accountId: string;
  certificateChallenge: string;
  expires: Date;
  macAddress: string;
  publicKey: string;
  uniqueId: string;
}

export interface IEnrolmentOptions extends IEntityBaseOptions {
  accountId: string;
  certificateChallenge: string;
  expires: Date;
  macAddress?: string;
  publicKey: string;
  uniqueId: string;
}

export class Enrolment extends EntityBase implements IEnrolment {
  readonly accountId: string;
  readonly certificateChallenge: string;
  readonly expires: Date;
  readonly macAddress: string;
  readonly publicKey: string;
  readonly uniqueId: string;

  constructor(options: IEnrolmentOptions) {
    super(options);

    this.accountId = options.accountId;
    this.certificateChallenge = options.certificateChallenge;
    this.expires = options.expires;
    this.macAddress = options.macAddress;
    this.publicKey = options.publicKey;
    this.uniqueId = options.uniqueId;
  }

  public create(): void {
    /* intentionally left empty */
  }
}
