import MockDate from "mockdate";
import { Device } from "./Device";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("Device.ts", () => {
  let device: Device;

  beforeEach(() => {
    device = new Device({
      accountId: "accountId",
      name: "name",
      pin: { signature: "pin", updated: date },
      publicKey: "publicKey",
      recoveryKeys: ["key1", "key2"],
      secret: { signature: "secret", updated: date },
    });
  });

  test("should have all data", () => {
    expect(device).toMatchSnapshot();
  });

  test("should have optional data", () => {
    device = new Device({
      accountId: "accountId",
      publicKey: "publicKey",
    });

    expect(device).toMatchSnapshot();
  });

  test("should create", () => {
    device.create();
    expect(device).toMatchSnapshot();
  });

  test("should get accountId", () => {
    expect(device.accountId).toMatchSnapshot();
  });

  test("should get/set name", () => {
    expect(device.name).toMatchSnapshot();

    device.name = "new-name";

    expect(device).toMatchSnapshot();
  });

  test("should get/set pin", () => {
    expect(device.pin).toMatchSnapshot();

    device.pin = { signature: "new-pin", updated: date };

    expect(device).toMatchSnapshot();
  });

  test("should get publicKey", () => {
    expect(device.publicKey).toBe("publicKey");
  });

  test("should get/set recovery keys", () => {
    expect(device.recoveryKeys).toMatchSnapshot();

    device.recoveryKeys = ["key1", "key2", "key3"];

    expect(device).toMatchSnapshot();
  });

  test("should get/set secret", () => {
    expect(device.secret).toMatchSnapshot();

    device.secret = { signature: "new-secret", updated: date };

    expect(device).toMatchSnapshot();
  });
});
