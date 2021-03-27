import { Enrolment } from "../../entity";
import { getTestKeyPairRSA } from "./test-key-pair";

export const getTestEnrolment = ({
  id = "d43e9912-b565-47c6-acd3-9ecd477d46bc",
  accountId = "57f93111-0d54-4626-8ed3-70cd0812389f",
  certificateChallenge = "ESJh38hYfJ7481UFTQgq63wxxiOub1Xt7YKGJIukrBlIA5RNR6rDriiQ977psN1u",
  expires = new Date("2099-01-01"),
  macAddress = "6905a710-fbe0-4f4e-83e7-2b6e6545a7be",
  name = "My iPhone X",
  publicKey = getTestKeyPairRSA().publicKey,
  uniqueId = "a097a56f506a4091b4c93a8bfb8cec0f",
}: {
  id?: string;
  accountId?: string;
  certificateChallenge?: string;
  expires?: Date;
  macAddress?: string;
  name?: string;
  publicKey?: string;
  uniqueId?: string;
}): Enrolment =>
  new Enrolment({
    id,
    accountId,
    certificateChallenge,
    expires,
    macAddress,
    name,
    publicKey,
    uniqueId,
  });
