import { IIndex } from "@lindorm-io/mongo";

export const indices: Array<IIndex> = [
  {
    index: { id: 1 },
    options: { unique: true },
  },
  {
    index: {
      accountId: 1,
      macAddress: 1,
      uniqueId: 1,
    },
    options: {
      name: "unique_on_account",
      unique: false,
    },
  },
];
