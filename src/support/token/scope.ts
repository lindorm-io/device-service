import { IKoaDeviceContext } from "../../typing";
import { InvalidScopeError } from "../../error";
import { isScope, Scope } from "@lindorm-io/jwt";

export const assertScope = (ctx: IKoaDeviceContext) => (expectedScopes: Array<Scope>): void => {
  const {
    token: {
      bearer: { scope },
    },
  } = ctx;

  for (const expect of expectedScopes) {
    if (isScope(scope, expect)) continue;
    throw new InvalidScopeError(scope, expect);
  }
};
