import MockDate from "mockdate";
import { config } from "../config";
import { getExpiryDate } from "./expiry";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2021-01-01T08:00:00.000Z");

describe("getExpiryDate", () => {
  test("should return a modified date for authorization token", () => {
    expect(getExpiryDate(config.CHALLENGE_EXPIRY)).toMatchSnapshot();
  });

  test("should return a modified date for refresh token", () => {
    expect(getExpiryDate(config.ENROLMENT_EXPIRY)).toMatchSnapshot();
  });
});
