import { InvalidPermissionError, InvalidScopeError } from "../error";
import { KoaDeviceContextAware } from "../class";
import { isAdmin, isScope, Scope } from "@lindorm-io/jwt";

export class AuthTokenHandler extends KoaDeviceContextAware {
  public assertAccountPermission(accountId: string): void {
    const { permission, scope, subject } = this.ctx.token.bearer;

    if (isAdmin(permission)) {
      return;
    }

    if (subject !== accountId) {
      throw new InvalidPermissionError();
    }

    if (!isScope(scope, Scope.DEFAULT)) {
      throw new InvalidPermissionError();
    }
  }

  public assertScope(expectedScopes: Array<Scope>): void {
    const { scope } = this.ctx.token.bearer;

    for (const expect of expectedScopes) {
      if (isScope(scope, expect)) continue;
      throw new InvalidScopeError(scope, expect);
    }
  }
}
