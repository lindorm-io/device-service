import { KoaContextAware } from "@lindorm-io/koa";
import { IKoaDeviceContext } from "../typing";

export abstract class KoaDeviceContextAware extends KoaContextAware {
  protected ctx: IKoaDeviceContext;

  constructor(ctx: IKoaDeviceContext) {
    super(ctx);
  }
}
