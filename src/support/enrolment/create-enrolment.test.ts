import MockDate from "mockdate";
import { getTestCache, inMemoryCache } from "../../test";
import { createEnrolment } from "./create-enrolment";

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

describe("createEnrolment", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = { cache: await getTestCache() };
  });

  test("should create an enrolment", async () => {
    await expect(
      createEnrolment(ctx)({
        accountId: "543afa16-ba6f-4f40-8882-30b4450cd59b",
        macAddress: "00:00:0A:BB:28:FC",
        name: "My iPhone 11 Pro",
        publicKey: "publicKey",
        uniqueId: "472704d28e5c4187b841",
      }),
    ).resolves.toMatchSnapshot();

    expect(inMemoryCache).toMatchSnapshot();
  });
});
