import { add } from "date-fns";
import { stringToDurationObject } from "@lindorm-io/core";

export const getExpiryDate = (expiry: string): Date => {
  return add(Date.now(), stringToDurationObject(expiry));
};
