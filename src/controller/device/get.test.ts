import MockDate from "mockdate";
import { deviceGetController } from "./get";
import { getTestDevice } from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("deviceGetController", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      entity: {
        device: await getTestDevice({
          id: "ded67066-ba3a-4898-b537-de12d4b7f86d",
          identityId: "b799b044-16db-495a-b7e1-2cf3175d4b54",
          installationId: "12be09f5-fcd4-438f-9b5d-dc1fb11e5e75",
          uniqueId: "27a10522a6994bbca0e1fc666804b350",
        }),
      },
    };
  });

  test("should resolve with device information", async () => {
    await expect(deviceGetController(ctx)).resolves.toStrictEqual({
      body: {
        id: "ded67066-ba3a-4898-b537-de12d4b7f86d",
        active: true,
        identityId: "b799b044-16db-495a-b7e1-2cf3175d4b54",
        installationId: "12be09f5-fcd4-438f-9b5d-dc1fb11e5e75",
        macAddress: "0B:ED:A0:D5:5A:2D",
        name: "Test Person's iPhone",
        os: "iPhone OS 13_5_1",
        platform: "iPhone",
        trusted: true,
        uniqueId: "27a10522a6994bbca0e1fc666804b350",
      },
    });
  });
});
