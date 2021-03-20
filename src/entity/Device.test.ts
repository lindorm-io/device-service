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
    expect(device.events).toMatchSnapshot();
  });

  test("should get accountId", () => {
    expect(device.accountId).toBe("accountId");
  });

  test("should get/set name", () => {
    expect(device.name).toBe("name");

    device.name = "new-name";

    expect(device.name).toBe("new-name");
    expect(device.events).toMatchSnapshot();
  });

  test("should get/set pin", () => {
    expect(device.pin).toStrictEqual({ signature: "pin", updated: date });

    device.pin = { signature: "new-pin", updated: date };

    expect(device.pin).toStrictEqual({ signature: "new-pin", updated: date });
    expect(device.events).toMatchSnapshot();
  });

  test("should get publicKey", () => {
    expect(device.publicKey).toBe("publicKey");
  });

  test("should get/set secret", () => {
    expect(device.secret).toStrictEqual({ signature: "secret", updated: date });

    device.secret = { signature: "new-secret", updated: date };

    expect(device.secret).toStrictEqual({ signature: "new-secret", updated: date });
    expect(device.events).toMatchSnapshot();
  });
});
