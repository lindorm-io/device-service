import { ChallengeSession, ChallengeSessionOptions } from "../../entity";
import { ChallengeStrategy } from "../../enum";

export const getTestChallengeSession = (
  options: Partial<ChallengeSessionOptions> = {},
): ChallengeSession =>
  new ChallengeSession({
    id: "9a1de3dd-1ce2-4c38-a38c-70f291c70e6e",
    certificateChallenge:
      "fU8ob4kqvPCfVCd5FdaM0hpXvpRoBx3VlPEWGarUP8DvTMj4AcFgieq2HMeH3uXK7MggvmLnG5iGGhUVMqDRhd7fRzW1XVveJe3CI7Pf3HlQpzqIOmrHGxes3yjZY3Es",
    deviceId: "4bfbd305-8296-427e-b212-7f4999181e58",
    nonce: "9ButQlX6uCfwftCS",
    payload: { test: true },
    scopes: ["test"],
    strategies: [
      ChallengeStrategy.BIOMETRY,
      ChallengeStrategy.IMPLICIT,
      ChallengeStrategy.PINCODE,
    ],
    ...options,
  });
