import { generateRecoveryKey } from "./generate-recovery-key";

jest.mock("@lindorm-io/core", () => ({
  getRandomValue: () => "ABCDE",
}));

describe("generateRecoveryKey", () => {
  test("should resolve a recovery key", () => {
    expect(generateRecoveryKey()).toBe("ABCDE-ABCDE-ABCDE-ABCDE-ABCDE-ABCDE");
  });
});
