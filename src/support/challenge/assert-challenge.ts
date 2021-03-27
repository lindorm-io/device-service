import { KeyPairHandler } from "@lindorm-io/key-pair";
import { AssertDeviceChallengeError, InvalidStrategyError } from "../../error";
import { IKoaDeviceContext } from "../../typing";
import { ChallengeStrategy } from "../../enum";

export interface IAssertCertificateChallengeOptions {
  challengeId: string;
  certificateVerifier: string;
  strategy: ChallengeStrategy;
}

export const assertChallenge = (ctx: IKoaDeviceContext) => async (
  options: IAssertCertificateChallengeOptions,
): Promise<void> => {
  const { cache, device } = ctx;
  const { challengeId, certificateVerifier, strategy } = options;

  const challenge = await cache.challenge.find(challengeId);

  if (strategy !== challenge.strategy) {
    throw new InvalidStrategyError(strategy, challenge.strategy);
  }

  const handler = new KeyPairHandler({
    algorithm: "RS512",
    passphrase: "",
    privateKey: null,
    publicKey: device.publicKey,
  });

  try {
    handler.assert(challenge.certificateChallenge, certificateVerifier);
  } catch (err) {
    throw new AssertDeviceChallengeError(challenge.certificateChallenge, certificateVerifier);
  }
};
