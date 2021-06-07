import { DeviceContextAware } from "../class";
import { isAdmin, isScope, Scope } from "@lindorm-io/jwt";
import { ClientError } from "@lindorm-io/errors";

export class AuthTokenHandler extends DeviceContextAware {
  public assertPermission(accountId: string): void {
    const { permission, scope, subject } = this.ctx.token.bearer;

    if (isAdmin(permission)) {
      return;
    }

    if (subject !== accountId) {
      throw new ClientError("Invalid Account", {
        debug: { subject, accountId },
        statusCode: ClientError.StatusCode.BAD_REQUEST,
      });
    }

    if (!isScope(scope, Scope.DEFAULT)) {
      throw new ClientError("Invalid Scope", {
        debug: { scope },
        statusCode: ClientError.StatusCode.BAD_REQUEST,
      });
    }
  }

  public assertScope(expectedScopes: Array<Scope>): void {
    const { scope } = this.ctx.token.bearer;

    for (const expect of expectedScopes) {
      if (isScope(scope, expect)) continue;
      throw new ClientError("Invalid Scope", {
        debug: { scope },
        statusCode: ClientError.StatusCode.BAD_REQUEST,
      });
    }
  }
}
