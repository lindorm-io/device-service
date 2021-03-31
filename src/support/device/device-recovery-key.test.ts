import { Device } from "../../entity";
import {
  encryptDeviceRecoveryKey,
  assertDeviceRecoveryKey,
  createDeviceRecoveryKey,
  createDeviceRecoveryKeys,
} from "./device-recovery-key";
import { InvalidDeviceRecoveryKeyError } from "../../error";

jest.mock("@lindorm-io/core", () => ({
  ...jest.requireActual("@lindorm-io/core"),
  getRandomNumber: jest.fn(() => "123456"),
}));

describe("encryptDeviceRecoveryKey", () => {
  test("should resolve", async () => {
    await expect(encryptDeviceRecoveryKey("secret")).resolves.not.toBe("secret");
  });
});

describe("assertDeviceRecoveryKey", () => {
  let device: Device;

  beforeEach(async () => {
    device = new Device({
      accountId: "account-id",
      publicKey: "public-key",
      recoveryKeys: [
        await encryptDeviceRecoveryKey("secret1"),
        await encryptDeviceRecoveryKey("secret2"),
        await encryptDeviceRecoveryKey("secret3"),
      ],
    });
  });

  test("should resolve on first try", async () => {
    await expect(assertDeviceRecoveryKey(device, "secret1")).resolves.toBe(undefined);
  });

  test("should resolve on third try", async () => {
    await expect(assertDeviceRecoveryKey(device, "secret3")).resolves.toBe(undefined);
  });

  test("should throw when no recovery key matches", async () => {
    await expect(assertDeviceRecoveryKey(device, "secret4")).rejects.toThrow(InvalidDeviceRecoveryKeyError);
  });
});

describe("createDeviceRecoveryKey", () => {
  test("should create recovery key", async () => {
    const result = await createDeviceRecoveryKey();
    expect(result.recoveryKey).toMatchSnapshot();
    expect(result.signature).toStrictEqual(expect.any(String));
  });
});

describe("createDeviceRecoveryKeys", () => {
  test("should create many recovery keys", async () => {
    const result = await createDeviceRecoveryKeys(6);
    expect(result.recoveryKeys).toMatchSnapshot();
    expect(result.signatures).toStrictEqual(expect.any(Array));
  });
});
