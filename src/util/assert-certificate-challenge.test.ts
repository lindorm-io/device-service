import { createSign } from "crypto";
import { assertCertificateChallenge } from "./assert-certificate-challenge";
import { CertificateMethod } from "../enum";
import { getRandomValue } from "@lindorm-io/core";
import { ClientError } from "@lindorm-io/errors";

const privateKey =
  "-----BEGIN ENCRYPTED PRIVATE KEY-----\n" +
  "MIIC3TBXBgkqhkiG9w0BBQ0wSjApBgkqhkiG9w0BBQwwHAQI73j2DruGoZgCAggA\n" +
  "MAwGCCqGSIb3DQIJBQAwHQYJYIZIAWUDBAEqBBA1zkvIdjMOkQqPC0VrDGruBIIC\n" +
  "gO+CBYavUokPVzUUWNhh/nZ/14bK5E0HOrYkawvotp0ERSTqM45bR8CaJZE9cogK\n" +
  "zS83KPYJq6Eudu7RRHEOptfmJV9XkWvykGDVyoV7XLHqRV0yaqKntIOi7ar1c/Jy\n" +
  "kamJ0dw1m8yhvp6u25WLAtPTkm9hJ3vneU2X+Hk9cbGtCuXzuaf7VOPmUx6Tr6TV\n" +
  "aQo5ZtcDBaatamI3Bq0PlCr75mR7eAjVaEN01PMaJNWYIS+Bqd64cU3cqZWl97/q\n" +
  "UVom7kMFnNwM+IJ1eCBPbMCvqhwccADcVEdSMAWLtS6OzMOC8UO+hhs+zirbnw2n\n" +
  "3iCqSbuu0Aekh8qQRRe7DV6myvkJtQJydN2qkKQHhOK+vONwIKgf8H4Xoyefo43D\n" +
  "RwExh4VwzVT1iDDHIsjIgEfOEwM6SKSpekfe1jzL4nEwQZyQjIHHpdDse5hrPw1G\n" +
  "CPZ8H9id679igFaPPtHyf85PH2oRjkVfJuUX5nFxrlkRF/U5pxC+7D/AbdEdAJFQ\n" +
  "es0JWzNfR54z5Pg6baojk4u7UggQMOSGNkTfZx5f9nWeTeiPp9fAnf/lE5FTjqWr\n" +
  "jSRuyplFwVBPcvy497gRlGJQh4SPwqFsurjV3yXl3mFbHCtrm967uR58yVuaF658\n" +
  "E0Dobem0s0Qexghaz/wuNRplaGUh+0kC5a8pJsB4vYVhq+goEhawisBriCt3JNeX\n" +
  "YZe1vw1+Ze/LCfxf6N8N+/d0OoYXavZGDiO3hebuJXgHtrM7zNZNLwq4RCvgGcBd\n" +
  "OwB9V2N3H2119vsfdASo399qL163UKUqNN3eWld9uL5h/HHLRYMTOloAOP9wJi31\n" +
  "8VnSW4qtRe+cZMZ0yuEVxmc=\n" +
  "-----END ENCRYPTED PRIVATE KEY-----\n";

const publicKey =
  "-----BEGIN RSA PUBLIC KEY-----\n" +
  "MIGJAoGBAKdVz2lIbQi1YU3Z0qRizpV9gAMW9Kmwms4aP+r7CKcu4w9/fMcV4v6P\n" +
  "zYHwnjvTEZ6gSqtxcpwT6EgBAgxFolqjeInOis2I+tcfxcShwcfMZ/E7kgktP15w\n" +
  "dsAFDTzmso9VtnBNgbt8afNea1nK25Fa+Zq+gztxkI5pkw1WFm4FAgMBAAE=\n" +
  "-----END RSA PUBLIC KEY-----\n";

const sign = (method: CertificateMethod, input: string): string => {
  const worker = createSign(method);
  worker.write(input);
  worker.end();

  return worker.sign({ key: privateKey, passphrase: "" }, "base64");
};

describe("assertCertificateChallenge", () => {
  let certificateChallenge: string;
  let certificateMethod: CertificateMethod;

  beforeAll(() => {
    certificateChallenge = getRandomValue(32);
  });

  test("should verify a signed challenge for SHA256", async () => {
    certificateMethod = CertificateMethod.SHA256;

    expect(
      assertCertificateChallenge({
        certificateChallenge,
        certificateMethod,
        certificateVerifier: sign(certificateMethod, certificateChallenge),
        publicKey,
      }),
    ).toBeUndefined();
  });

  test("should verify a signed challenge for SHA384", async () => {
    certificateMethod = CertificateMethod.SHA384;

    expect(
      assertCertificateChallenge({
        certificateChallenge,
        certificateMethod,
        certificateVerifier: sign(certificateMethod, certificateChallenge),
        publicKey,
      }),
    ).toBeUndefined();
  });

  test("should verify a signed challenge for SHA512", async () => {
    certificateMethod = CertificateMethod.SHA512;

    expect(
      assertCertificateChallenge({
        certificateChallenge,
        certificateMethod,
        certificateVerifier: sign(certificateMethod, certificateChallenge),
        publicKey,
      }),
    ).toBeUndefined();
  });

  test("should throw on invalid challenge", async () => {
    certificateMethod = CertificateMethod.SHA256;

    expect(() =>
      assertCertificateChallenge({
        certificateChallenge: getRandomValue(32),
        certificateMethod,
        certificateVerifier: sign(certificateMethod, certificateChallenge),
        publicKey,
      }),
    ).toThrow(ClientError);
  });

  test("should throw on invalid method", async () => {
    expect(() =>
      assertCertificateChallenge({
        certificateChallenge,
        certificateMethod: CertificateMethod.SHA384,
        certificateVerifier: sign(CertificateMethod.SHA256, certificateChallenge),
        publicKey,
      }),
    ).toThrow(ClientError);
  });

  test("should throw on invalid verifier method", async () => {
    certificateMethod = CertificateMethod.SHA256;

    expect(() =>
      assertCertificateChallenge({
        certificateChallenge,
        certificateMethod,
        certificateVerifier: sign(CertificateMethod.SHA384, certificateChallenge),
        publicKey,
      }),
    ).toThrow(ClientError);
  });

  test("should throw on invalid verifier challenge", async () => {
    certificateMethod = CertificateMethod.SHA256;

    expect(() =>
      assertCertificateChallenge({
        certificateChallenge,
        certificateMethod,
        certificateVerifier: sign(certificateMethod, getRandomValue(32)),
        publicKey,
      }),
    ).toThrow(ClientError);
  });

  test("should throw on invalid public key", async () => {
    certificateMethod = CertificateMethod.SHA256;

    expect(() =>
      assertCertificateChallenge({
        certificateChallenge,
        certificateMethod,
        certificateVerifier: sign(certificateMethod, certificateChallenge),
        publicKey:
          "-----BEGIN RSA PUBLIC KEY-----\n" +
          "MIICCgKCAgEAybQm2T+bls/+8+gBZ36r2FGbfytCUjpLT/bRZPsg4W7SEeCVUexh\n" +
          "28UaUyZSTQGxqWbwZR9Tdmh/W5PDjo+P0bORrdbT2pYkDVVlXoODYN1WLswBEuOD\n" +
          "arCsVDhBhpSbo7DkKJrzrQFjdmRjAqd5Ekl4uftqggIP8B5U797PylljmmFe5h7D\n" +
          "wdR19WpOndnDQA1go1rx/qV7Uc9Vgf1Tin5k72G8J/RVT4CJvOs7vV2AF5XXXCQl\n" +
          "+YmDXBKJ10yxqhbCO+6uSPERyZkczGHlaYlzrvB013B78Ll9s+EFatHHttQvzO9p\n" +
          "BUsS5rhcc4aQTA2kSSHF2UoHmKd25kvL8e8xYOhqoYp+7hC3QHKUblh7G5jseUWu\n" +
          "RfkwTv9XPWQPCiYFCFP6rAl88AD8XbkHaGz47X42tzTfqz/j9VTMqSfGwwlIkpCC\n" +
          "I+ssZ2DVlzsKlx2hIFyNMRwSOWRHVwflvDB3smd69wNiwDJjl+0LWydgDl/g3KkC\n" +
          "LpsE/2mU6/EWZTkMgFfp7XAjOuz9hQzuf13uKx/5bjKYTTD7ev8guqlfsSBugDJg\n" +
          "c0VoYkOtd30YENBRdpmE20MNkHnzzFd9bjm4j4ZaIU3xZDe9me/5mInqZuILcl90\n" +
          "GFeCXe7QQ+mEe55+DNs1jV3Z1pZj7eG2hmAJBLSMF7ksee46okGD6D0CAwEAAQ==\n" +
          "-----END RSA PUBLIC KEY-----\n",
      }),
    ).toThrow(ClientError);
  });
});
