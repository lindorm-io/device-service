import { AuthTokenHandler } from "./AuthTokenHandler";
import { ClientError } from "@lindorm-io/errors";
import { Permission, Scope } from "@lindorm-io/jwt";
import { context } from "../test";

describe("AuthTokenHandler", () => {
  let ctx: any;
  let handler: AuthTokenHandler;

  beforeEach(() => {
    ctx = {
      ...context,
      token: {
        bearer: {
          permission: Permission.USER,
          scope: [Scope.DEFAULT],
          subject: "74319107-1246-4424-961d-0895c13ad248",
        },
      },
    };
    handler = new AuthTokenHandler(ctx);
  });

  describe("assertPermission", () => {
    test("should assert admin permission", () => {
      ctx.token.bearer.permission = Permission.ADMIN;

      expect(() => handler.assertPermission("bfec6872-e074-42e6-a99a-299bec497bc7")).not.toThrow();
    });

    test("should assert user permission", () => {
      expect(() => handler.assertPermission("74319107-1246-4424-961d-0895c13ad248")).not.toThrow();
    });

    test("should throw error on invalid permission", () => {
      expect(() => handler.assertPermission("bfec6872-e074-42e6-a99a-299bec497bc7")).toThrow(ClientError);
    });

    test("should throw error on invalid scope", () => {
      ctx.token.bearer.scope = "wrong";

      expect(() => handler.assertPermission("74319107-1246-4424-961d-0895c13ad248")).toThrow(ClientError);
    });
  });

  describe("assertScope", () => {
    test("should assert scope", () => {
      expect(() => handler.assertScope([Scope.DEFAULT])).not.toThrow();
    });

    test("should throw error on invalid scope", () => {
      expect(() => handler.assertScope([Scope.OPENID])).toThrow(ClientError);
    });
  });
});
