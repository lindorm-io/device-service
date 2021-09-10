import { CertificateMethod } from "../enum";
import { ClientError } from "@lindorm-io/errors";
import { createVerify } from "crypto";

interface Options {
  certificateChallenge: string;
  certificateMethod: CertificateMethod;
  certificateVerifier: string;
  publicKey: string;
}

export const assertCertificateChallenge = (options: Options): void => {
  const { certificateChallenge, certificateMethod, certificateVerifier, publicKey } =
    options;

  const worker = createVerify(certificateMethod);
  worker.write(certificateChallenge);
  worker.end();

  const result = worker.verify({ key: publicKey }, certificateVerifier, "base64");

  if (result) return;

  throw new ClientError("Conflict", {
    debug: {
      certificateChallenge,
      certificateVerifier,
    },
    description: "Invalid certificate verifier",
    statusCode: ClientError.StatusCode.CONFLICT,
  });
};
