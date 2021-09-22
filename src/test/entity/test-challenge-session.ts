import { ChallengeSession, ChallengeSessionOptions } from "../../entity";
import { ChallengeStrategy } from "../../enum";
import { getRandomString } from "@lindorm-io/core";

export const getTestChallengeSession = (
  options: Partial<ChallengeSessionOptions> = {},
): ChallengeSession =>
  new ChallengeSession({
    certificateChallenge:
      "fU8ob4kqvPCfVCd5FdaM0hpXvpRoBx3VlPEWGarUP8DvTMj4AcFgieq2HMeH3uXK7MggvmLnG5iGGhUVMqDRhd7fRzW1XVveJe3CI7Pf3HlQpzqIOmrHGxes3yjZY3Es",
    deviceId: "4bfbd305-8296-427e-b212-7f4999181e58",
    nonce: getRandomString(16),
    payload: { test: true },
    scopes: ["test"],
    strategies: [
      ChallengeStrategy.BIOMETRY,
      ChallengeStrategy.IMPLICIT,
      ChallengeStrategy.PINCODE,
    ],
    ...options,
  });
