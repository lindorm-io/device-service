import { Algorithm } from "@lindorm-io/key-pair";
import { Audience, ChallengeScope, ChallengeStrategy } from "../enum";
import { Challenge } from "../entity";
import { ClientError } from "@lindorm-io/errors";
import { CryptoKeyPair } from "@lindorm-io/crypto";
import { DeviceContextAware } from "../class";
import { IssuerSignData } from "@lindorm-io/jwt";
import { config } from "../config";
import { getExpiryDate } from "../util";
import { getRandomValue } from "@lindorm-io/core";
import { isAfter } from "date-fns";

export class ChallengeHandler extends DeviceContextAware {
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
      throw new ClientError("Invalid Strategy", {
        data: { strategy, expect },
        description: "Strategy does not match challenge",
        statusCode: ClientError.StatusCode.BAD_REQUEST,
      });
    }

    const keyPairHandler = new CryptoKeyPair({
      algorithm: Algorithm.RS512,
      passphrase: "",
      privateKey: null,
      publicKey: device.publicKey,
    });

    try {
      keyPairHandler.assert(challenge.certificateChallenge, certificateVerifier);
    } catch (err) {
      throw new ClientError("Invalid Certificate Challenge", {
        debug: { certificateChallenge: challenge.certificateChallenge, certificateVerifier },
        statusCode: ClientError.StatusCode.FORBIDDEN,
      });
    }
  }

  public isNotExpired(challenge: Challenge): void {
    if (isAfter(new Date(), new Date(challenge.expires))) {
      throw new ClientError("Invalid Challenge", {
        description: "Challenge has expired",
        debug: {
          id: challenge.id,
          expires: challenge.expires,
        },
        statusCode: ClientError.StatusCode.UNAUTHORIZED,
      });
    }
  }

  public getConfirmationToken(): IssuerSignData {
    const { challenge, device } = this.ctx.entity;

    this.ctx.logger.debug("creating challenge confirmation token", {
      client: this.ctx.metadata.clientId,
      device: device.id,
      account: device.accountId,
      scope: challenge.scope,
    });

    return this.ctx.jwt.sign({
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
