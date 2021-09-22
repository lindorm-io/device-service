import { mongoQuery, QueryCallback } from "@lindorm-io/mongo";
import { winston } from "../logger";
import { mongoConnection } from "../instance";

const callback: QueryCallback = async ({ db }) => {
  const collections = await db.collections();

  for (const collection of collections) {
    await collection.dropIndexes();
  }
};

mongoQuery(mongoConnection, winston, callback)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
