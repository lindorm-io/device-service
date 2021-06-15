import { EnrolmentSession } from "../entity";

export interface ICreateDeviceFromEnrolmentOptions {
  enrolment: EnrolmentSession;
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

export interface IInitialiseEnrolmentOptions {
  macAddress: string;
  name: string;
  publicKey: string;
  uniqueId: string;
}

export interface IInitialiseEnrolmentData {
  certificateChallenge: string;
  enrolmentId: string;
  expires: Date;
}

export interface IConcludeEnrolmentOptions {
  certificateVerifier: string;
  enrolmentId: string;
  pin: string;
  secret?: string;
}

export interface IConcludeEnrolmentData {
  deviceId: string;
  recoveryKey: string;
}
