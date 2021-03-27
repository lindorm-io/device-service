import { Challenge } from "../../entity";
import { ExpiredChallengeError } from "../../error";
import { isAfter } from "date-fns";

export const assertChallengeIsNotExpired = (challenge: Challenge): void => {
  if (isAfter(new Date(), new Date(challenge.expires))) {
    throw new ExpiredChallengeError(challenge);
  }
};
