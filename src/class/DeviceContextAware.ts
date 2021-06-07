import { DeviceContext } from "../typing";
import { KoaContextAware } from "@lindorm-io/koa";

export abstract class DeviceContextAware extends KoaContextAware {
  protected declare readonly ctx: DeviceContext;
}
