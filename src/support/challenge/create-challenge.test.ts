import MockDate from "mockdate";
import { getTestCache, inMemoryCache } from "../../test";
import { createChallenge } from "./create-challenge";
import { ChallengeStrategy } from "../../enum";
import { Device } from "../../entity";

jest.mock("uuid", () => ({
  v4: () => "bc54a8e9-3246-4cad-8244-0a1a42c914cd",
}));
jest.mock("@lindorm-io/core", () => ({
  ...jest.requireActual("@lindorm-io/core"),
  getRandomValue: jest.fn(() => "ESJh38hYfJ7481UFTQgq63wxxiOub1Xt7YKGJIukrBlIA5RNR6rDriiQ977psN1u"),
}));
jest.mock("../../util", () => ({
  getExpiryDate: jest.fn(() => new Date()),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("createChallenge", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
      device: new Device({
        id: "c12b0d8e-956e-4556-927c-c8588a71a4e1",
        accountId: "0e219ec4-66fd-4d96-a17f-bdbf89edea03",
        publicKey: "publicKey",
      }),
    };
  });

  test("should create a challenge", async () => {
    await expect(createChallenge(ctx)({ strategy: ChallengeStrategy.IMPLICIT })).resolves.toMatchSnapshot();
    expect(inMemoryCache).toMatchSnapshot();
  });
});
