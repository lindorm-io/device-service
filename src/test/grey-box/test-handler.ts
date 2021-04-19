import { getTestChallenge } from "./test-challenge";
import { baseHash } from "@lindorm-io/core";
import { getTestEnrolment } from "./test-enrolment";
import { getTestDevice } from "./test-device";

export const getTestHandler = () => ({
  authTokenHandler: {
    assertPermission: () => {},
    assertScope: () => {},
  },
  challengeHandler: {
    create: async () => getTestChallenge({}),
    assert: async () => {},
    isNotExpired: () => {},
    getConfirmationToken: () => "getConfirmationToken",
  },
  deviceHandler: {
    encryptPin: async (input: string) => baseHash(input),
    assertPin: async () => {},
    encryptSecret: async (input: string) => baseHash(input),
    assertSecret: async () => {},
    generateRecoveryKey: async () => "AAAA-111222-BBBB-333444-CCCC",
    encryptRecoveryKey: async (input: string) => baseHash(input),
    assertRecoveryKey: async () => {},
  },
  enrolmentHandler: {
    create: async () => getTestEnrolment({}),
    assert: async () => getTestEnrolment({}),
    createDevice: async () =>
      getTestDevice({
        pin: null,
        recoveryKey: null,
        secret: null,
      }),
    removeDevice: async () => {},
  },
});
