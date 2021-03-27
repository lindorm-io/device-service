import MockDate from "mockdate";
import { CHALLENGE_EXPIRY, ENROLMENT_EXPIRY } from "../config";
import { getExpiryDate } from "./expiry";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getExpiryDate", () => {
  test("should return a modified date for authorization token", () => {
    expect(getExpiryDate(CHALLENGE_EXPIRY)).toMatchSnapshot();
  });

  test("should return a modified date for refresh token", () => {
    expect(getExpiryDate(ENROLMENT_EXPIRY)).toMatchSnapshot();
  });
});
