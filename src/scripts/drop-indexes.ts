import { Db } from "mongodb";
import { Logger } from "@lindorm-io/winston";
import { MONGO_CONNECTION_OPTIONS } from "../config";
import { mongoQuery } from "@lindorm-io/mongo";
import { winston } from "../logger";

(async () => {
  try {
    await mongoQuery(
      { logger: winston, mongoOptions: MONGO_CONNECTION_OPTIONS },
      async ({ db }: { db: Db; logger: Logger }) => {
        const collections = await db.collections();

        for (const collection of collections) {
          await collection.dropIndexes();
        }
      },
    );
  } catch (err) {
    winston.error("error", err);
  } finally {
    process.exit(0);
  }
})();
