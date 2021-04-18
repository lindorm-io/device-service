import { Enrolment } from "../entity";

export interface ICreateDeviceFromEnrolmentOptions {
  enrolment: Enrolment;
  pin: string;
  recoveryKey: string;
  secret?: string;
}

export interface ICreateEnrolmentOptions {
  accountId: string;
  macAddress: string;
  name: string;
  publicKey: string;
  uniqueId: string;
}
