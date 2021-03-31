import { InvalidPermissionError } from "../../error";
import { Permission, Scope } from "@lindorm-io/jwt";
import { assertAccountPermission } from "./permission";

describe("assertAccountPermission", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      token: {
        bearer: {
          permission: Permission.USER,
          scope: [Scope.DEFAULT],
          subject: "74319107-1246-4424-961d-0895c13ad248",
        },
      },
    };
  });

  test("should assert admin permission", async () => {
    ctx.token.bearer.permission = Permission.ADMIN;

    await expect(assertAccountPermission(ctx)("bfec6872-e074-42e6-a99a-299bec497bc7")).resolves.toBe(undefined);
  });

  test("should assert user permission", async () => {
    await expect(assertAccountPermission(ctx)("74319107-1246-4424-961d-0895c13ad248")).resolves.toBe(undefined);
  });

  test("should throw error on invalid permission", async () => {
    await expect(assertAccountPermission(ctx)("bfec6872-e074-42e6-a99a-299bec497bc7")).rejects.toStrictEqual(
      expect.any(InvalidPermissionError),
    );
  });

  test("should throw error on invalid scope", async () => {
    ctx.token.bearer.scope = "wrong";

    await expect(assertAccountPermission(ctx)("74319107-1246-4424-961d-0895c13ad248")).rejects.toStrictEqual(
      expect.any(InvalidPermissionError),
    );
  });
});
