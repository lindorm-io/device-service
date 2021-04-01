import MockDate from "mockdate";
import { Device } from "../../entity";
import { getTestRepository, inMemoryStore, resetStore } from "../../test";
import { generateNewRecoveryKeys } from "./generate-new-recovery-keys";
import { winston } from "../../logger";

jest.mock("../../support", () => ({
  assertScope: jest.fn(() => () => {}),
  createDeviceRecoveryKeys: jest.fn(() => ({
    recoveryKeys: ["key1", "key2", "key3"],
    signatures: ["sig1", "sig2", "sig3"],
  })),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("generateNewRecoveryKeys", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      logger: winston,
      repository: await getTestRepository(),
      token: {
        challengeConfirmation: {
          deviceId: "d7230fc6-322f-44d9-9ef6-b2abba9ad6a4",
        },
      },
    };

    await ctx.repository.device.create(
      new Device({
        id: "d7230fc6-322f-44d9-9ef6-b2abba9ad6a4",
        accountId: "eaf6491b-d3c5-4122-b246-5a28cbe2ff3c",
        publicKey: "publicKey",
      }),
    );
  });

  afterEach(resetStore);

  test("should update device pin", async () => {
    await expect(generateNewRecoveryKeys(ctx)()).resolves.toMatchSnapshot();
    expect(inMemoryStore).toMatchSnapshot();
  });
});
