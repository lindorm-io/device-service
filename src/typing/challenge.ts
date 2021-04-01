import { ChallengeScope, ChallengeStrategy } from "../enum";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";

export interface IInitialiseChallengeOptions {
  scope: ChallengeScope;
  strategy: ChallengeStrategy;
}

export interface IInitialiseChallengeData {
  challengeId: string;
  certificateChallenge: string;
  expires: Date;
}

export interface IVerifyChallengeOptions {
  certificateVerifier: string;
  strategy: ChallengeStrategy;
}

export interface IVerifyChallengeWithPinOptions extends IVerifyChallengeOptions {
  pin: string;
}

export interface IVerifyChallengeWithRecoveryKeyOptions extends IVerifyChallengeOptions {
  recoveryKey: string;
}

export interface IVerifyChallengeWithSecretOptions extends IVerifyChallengeOptions {
  secret: string;
}

export interface IVerifyChallengeData {
  challengeConfirmation: ITokenIssuerSignData;
}

export interface IVerifyChallengeWithRecoveryKeyData {
  challengeConfirmation: ITokenIssuerSignData;
  recoveryKeys: Array<string>;
}
