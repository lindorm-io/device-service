import { Challenge } from "../../entity";
import { ChallengeStrategy } from "../../enum";

export const getTestChallenge = ({
  id = "eb14da97-6c96-4833-8046-54d1697d7a49",
  certificateChallenge = "ESJh38hYfJ7481UFTQgq63wxxiOub1Xt7YKGJIukrBlIA5RNR6rDriiQ977psN1u",
  deviceId = "d9b9adec-81fa-4ea0-8cf3-44ccd4fe5162",
  expires = new Date("2099-01-01"),
  strategy = ChallengeStrategy.IMPLICIT,
}: {
  id?: string;
  certificateChallenge?: string;
  deviceId?: string;
  expires?: Date;
  strategy?: ChallengeStrategy;
}): Challenge =>
  new Challenge({
    id,
    certificateChallenge,
    deviceId,
    expires,
    strategy,
  });
