import { Enrolment } from "../../entity";
import { getTestKeyPairRSA } from "./test-key-pair";

export const getTestEnrolment = ({
  id = "d43e9912-b565-47c6-acd3-9ecd477d46bc",
  accountId = "51cc7c03-3f86-44ae-8be2-5fcf5536c08b",
  certificateChallenge = "ESJh38hYfJ7481UFTQgq63wxxiOub1Xt7YKGJIukrBlIA5RNR6rDriiQ977psN1u",
  expires = new Date("2099-01-01"),
  macAddress = "0025:96FF:FE12:3456",
  name = "My iPhone 12",
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
