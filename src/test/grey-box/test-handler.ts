import { getTestChallenge } from "./test-challenge";
import { baseHash } from "@lindorm-io/core";
import { getTestEnrolment } from "./test-enrolment";
import { getTestDevice } from "./test-device";
import { AuthTokenHandler, ChallengeHandler, DeviceHandler, EnrolmentHandler } from "../../handler";

interface TestHandler {
  authTokenHandler: AuthTokenHandler;
  challengeHandler: ChallengeHandler;
  deviceHandler: DeviceHandler;
  enrolmentHandler: EnrolmentHandler;
}

export const getTestHandler = (): TestHandler =>
  ({
    authTokenHandler: {
      assertPermission: (): void => undefined,
      assertScope: (): void => undefined,
    },
    challengeHandler: {
      create: async () => getTestChallenge({}),
      assert: async (): Promise<void> => undefined,
      isNotExpired: (): void => undefined,
      getConfirmationToken: () => "getConfirmationToken",
    },
    deviceHandler: {
      encryptPin: async (input: string) => baseHash(input),
      assertPin: async (): Promise<void> => undefined,
      encryptSecret: async (input: string) => baseHash(input),
      assertSecret: async (): Promise<void> => undefined,
      generateRecoveryKey: async () => "AAAA-111222-BBBB-333444-CCCC",
      encryptRecoveryKey: async (input: string) => baseHash(input),
      assertRecoveryKey: async (): Promise<void> => undefined,
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
      removeDevice: async (): Promise<void> => undefined,
    },
  } as unknown as TestHandler);
