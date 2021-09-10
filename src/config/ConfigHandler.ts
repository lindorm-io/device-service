import { Configuration } from "./interface";
import { ConfigurationBase, ConfigurationOptions } from "@lindorm-io/koa-config";

export class ConfigHandler extends ConfigurationBase<Configuration> {
  public constructor(options: ConfigurationOptions<Configuration>) {
    super(options);
  }
}
