import { MongoConnection } from "@lindorm-io/mongo";
import { config } from "../config";
import { winston } from "../logger";

export const mongoConnection = new MongoConnection({
  host: config.MONGO_HOST,
  port: config.MONGO_PORT,
  auth: {
    username: config.MONGO_USERNAME,
    password: config.MONGO_PASSWORD,
  },
  database: config.MONGO_DB_NAME,
  winston,
});
