import MockDate from "mockdate";
import { ExpiredChallengeError } from "../../error";
import { assertChallengeIsNotExpired } from "./expires";
import { getTestChallenge } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("assertAuthorizationIsNotExpired", () => {
  test("should succeed when date is before", () => {
    expect(assertChallengeIsNotExpired(getTestChallenge({}))).toMatchSnapshot();
  });

  test("should throw error when date is after", () => {
    expect(() =>
      assertChallengeIsNotExpired(
        getTestChallenge({
          expires: new Date("1999-01-01 01:00:00.000"),
        }),
      ),
    ).toThrow(expect.any(ExpiredChallengeError));
  });
});
