import { Algorithm, KeyPairHandler } from "@lindorm-io/key-pair";
import { Audience, ChallengeScope, ChallengeStrategy } from "../enum";
import { Challenge } from "../entity";
import { ExpiredChallengeError, InvalidCertificateVerifierError, InvalidStrategyError } from "../error";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";
import { KoaDeviceContextAware } from "../class";
import { config } from "../config";
import { getExpiryDate } from "../util";
import { getRandomValue } from "@lindorm-io/core";
import { isAfter } from "date-fns";

export class ChallengeHandler extends KoaDeviceContextAware {
  public async create(strategy: ChallengeStrategy, scope: ChallengeScope): Promise<Challenge> {
    const { challengeCache } = this.ctx.cache;
    const { device } = this.ctx.entity;

    return await challengeCache.create(
      new Challenge({
        certificateChallenge: getRandomValue(64),
        deviceId: device.id,
        expires: getExpiryDate(config.CHALLENGE_EXPIRY),
        scope,
        strategy,
      }),
    );
  }

  public async assert(strategy: ChallengeStrategy, certificateVerifier: string): Promise<void> {
    const { challenge, device } = this.ctx.entity;

    if (strategy !== challenge.strategy) {
      throw new InvalidStrategyError(strategy, challenge.strategy);
    }

    const keyPairHandler = new KeyPairHandler({
      algorithm: Algorithm.RS512,
      passphrase: "",
      privateKey: null,
      publicKey: device.publicKey,
    });

    try {
      keyPairHandler.assert(challenge.certificateChallenge, certificateVerifier);
    } catch (err) {
      throw new InvalidCertificateVerifierError(challenge.certificateChallenge, certificateVerifier);
    }
  }

  public isNotExpired(challenge: Challenge): void {
    if (isAfter(new Date(), new Date(challenge.expires))) {
      throw new ExpiredChallengeError(challenge);
    }
  }

  public getConfirmationToken(): ITokenIssuerSignData {
    const { challenge, device } = this.ctx.entity;
    const { deviceIssuer } = this.ctx.issuer;

    this.ctx.logger.debug("creating challenge confirmation token", {
      client: this.ctx.metadata.clientId,
      device: device.id,
      account: device.accountId,
      scope: challenge.scope,
    });

    return deviceIssuer.sign({
      id: challenge.id,
      audience: Audience.CHALLENGE_CONFIRMATION,
      clientId: this.ctx.metadata.clientId,
      deviceId: device.id,
      expiry: config.CHALLENGE_CONFIRMATION_EXPIRY,
      scope: [challenge.scope],
      subject: device.accountId,
    });
  }
}
