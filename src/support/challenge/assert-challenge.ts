import { Algorithm, KeyPairHandler } from "@lindorm-io/key-pair";
import { Challenge } from "../../entity";
import { ChallengeStrategy } from "../../enum";
import { IKoaDeviceContext } from "../../typing";
import { InvalidCertificateVerifierError, InvalidStrategyError } from "../../error";

interface IAssertChallengeOptions {
  challengeId: string;
  certificateVerifier: string;
  strategy: ChallengeStrategy;
}

export const assertChallenge = (ctx: IKoaDeviceContext) => async (
  options: IAssertChallengeOptions,
): Promise<Challenge> => {
  const { cache, device } = ctx;
  const { challengeId, certificateVerifier, strategy } = options;

  const challenge = await cache.challenge.find(challengeId);

  if (strategy !== challenge.strategy) {
    throw new InvalidStrategyError(strategy, challenge.strategy);
  }

  const handler = new KeyPairHandler({
    algorithm: Algorithm.RS512,
    passphrase: "",
    privateKey: null,
    publicKey: device.publicKey,
  });

  try {
    handler.assert(challenge.certificateChallenge, certificateVerifier);
  } catch (err) {
    throw new InvalidCertificateVerifierError(challenge.certificateChallenge, certificateVerifier);
  }

  return challenge;
};
