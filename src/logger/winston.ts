import { Logger, LogLevel } from "@lindorm-io/winston";
import { IS_TEST, NODE_ENVIRONMENT } from "../config";
import { NodeEnvironment } from "@lindorm-io/koa-config";
import { join } from "path";
import { readFileSync } from "fs";
import { sanitiseToken } from "@lindorm-io/jwt";

const pkg = readFileSync(join(__dirname, "..", "..", "package.json"), { encoding: "utf8" });
const { name, version } = JSON.parse(pkg);

export const winston = new Logger({
  packageName: name,
  packageVersion: version,
  test: IS_TEST,
});

if (NODE_ENVIRONMENT === NodeEnvironment.PRODUCTION) {
  winston.addFileTransport(LogLevel.ERROR);
  winston.addFileTransport(LogLevel.WARN);
  winston.addFileTransport(LogLevel.INFO);
  winston.addFileTransport(LogLevel.VERBOSE);
  winston.addFileTransport(LogLevel.DEBUG);
  winston.addFileTransport(LogLevel.SILLY);

  winston.addFilter("request.header.authorization", sanitiseToken);

  winston.addFilter("request.body.pin");
  winston.addFilter("pin");

  winston.addFilter("request.body.publicKey");
  winston.addFilter("publicKey");

  winston.addFilter("request.body.secret");
  winston.addFilter("secret");
}

if (NODE_ENVIRONMENT !== NodeEnvironment.PRODUCTION) {
  winston.addConsole(LogLevel.DEBUG);
}
