import { IIndex } from "@lindorm-io/mongo";

export const indices: Array<IIndex> = [
  {
    index: { id: 1 },
    options: { unique: true },
  },
  {
    index: { accountId: 1 },
    options: { unique: false },
  },
];
