import MockDate from "mockdate";
import { deviceGetListController } from "./get-list";
import { getTestDevice } from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("deviceGetListController", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      repository: {
        deviceRepository: {
          findMany: async () => [
            await getTestDevice({ id: "ded67066-ba3a-4898-b537-de12d4b7f86d" }),
            await getTestDevice({ id: "616b4b54-608f-4e88-805e-a43dd2b2ecc4" }),
          ],
        },
      },
      token: {
        bearerToken: {
          subject: "identityId",
        },
      },
    };
  });

  test("should resolve with list of devices", async () => {
    await expect(deviceGetListController(ctx)).resolves.toStrictEqual({
      body: {
        devices: [
          {
            id: "ded67066-ba3a-4898-b537-de12d4b7f86d",
            active: true,
            name: "Test Person's iPhone",
            platform: "iPhone",
            trusted: true,
          },
          {
            id: "616b4b54-608f-4e88-805e-a43dd2b2ecc4",
            active: true,
            name: "Test Person's iPhone",
            platform: "iPhone",
            trusted: true,
          },
        ],
      },
    });
  });
});
