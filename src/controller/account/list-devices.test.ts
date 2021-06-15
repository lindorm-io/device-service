import MockDate from "mockdate";
import { ClientError } from "@lindorm-io/errors";
import { Scope } from "@lindorm-io/jwt";
import { accountListDevices } from "./list-devices";
import { logger } from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("accountListDevices", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      logger,
      repository: {
        deviceRepository: {
          findMany: async () => [
            { id: "id-1", macAddress: "macAddress", name: "name", uniqueId: "uniqueId" },
            { id: "id-2", macAddress: "macAddress", name: "name", uniqueId: "uniqueId" },
            { id: "id-3", macAddress: "macAddress", name: "name", uniqueId: "uniqueId" },
          ],
        },
      },
      token: {
        bearerToken: {
          scope: [Scope.DEFAULT],
          subject: "subject",
        },
      },
    };
  });

  test("should resolve with list of devices", async () => {
    await expect(accountListDevices(ctx)).resolves.toStrictEqual({
      body: {
        devices: [
          { id: "id-1", macAddress: "macAddress", name: "name", uniqueId: "uniqueId" },
          { id: "id-2", macAddress: "macAddress", name: "name", uniqueId: "uniqueId" },
          { id: "id-3", macAddress: "macAddress", name: "name", uniqueId: "uniqueId" },
        ],
      },
      status: 200,
    });
  });

  test("should throw on invalid scope", async () => {
    ctx.token.bearerToken.scope = [];

    await expect(accountListDevices(ctx)).rejects.toThrow(ClientError);
  });
});
