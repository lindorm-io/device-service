import * as config from "./config";

describe("config", () => {
  test("should provide configuration", () => {
    expect(config).toMatchSnapshot();
  });
});
