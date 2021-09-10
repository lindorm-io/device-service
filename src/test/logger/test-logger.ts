import { Logger } from "@lindorm-io/winston";

export const logger = {
  error: (): void => undefined,
  warn: (): void => undefined,
  info: (): void => undefined,
  verbose: (): void => undefined,
  debug: (): void => undefined,
  silly: (): void => undefined,
  createChildLogger: () => logger,
} as unknown as Logger;
