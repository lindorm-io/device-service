import { Algorithm, KeyPairHandler } from "@lindorm-io/key-pair";
import { Enrolment } from "../../entity";
import { IKoaDeviceContext } from "../../typing";
import { InvalidCertificateVerifierError } from "../../error";

interface IAssertEnrolmentOptions {
  certificateVerifier: string;
  enrolmentId: string;
}

export const assertEnrolment = (ctx: IKoaDeviceContext) => async (
  options: IAssertEnrolmentOptions,
): Promise<Enrolment> => {
  const { cache } = ctx;
  const { certificateVerifier, enrolmentId } = options;

  const enrolment = await cache.enrolment.find(enrolmentId);

  const handler = new KeyPairHandler({
    algorithm: Algorithm.RS512,
    passphrase: "",
    privateKey: null,
    publicKey: enrolment.publicKey,
  });

  try {
    handler.assert(enrolment.certificateChallenge, certificateVerifier);
  } catch (err) {
    throw new InvalidCertificateVerifierError(enrolment.certificateChallenge, certificateVerifier);
  }

  return enrolment;
};
