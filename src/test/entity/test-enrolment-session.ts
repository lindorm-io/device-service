import { EnrolmentSession, EnrolmentSessionOptions } from "../../entity";
import { CertificateMethod } from "../../enum";

export const getTestEnrolmentSession = (
  options: Partial<EnrolmentSessionOptions> = {},
): EnrolmentSession =>
  new EnrolmentSession({
    id: "fd0d2132-fc73-4260-88a5-6f162b10c06f",
    certificateChallenge:
      "fU8ob4kqvPCfVCd5FdaM0hpXvpRoBx3VlPEWGarUP8DvTMj4AcFgieq2HMeH3uXK7MggvmLnG5iGGhUVMqDRhd7fRzW1XVveJe3CI7Pf3HlQpzqIOmrHGxes3yjZY3Es",
    certificateMethod: CertificateMethod.SHA512,
    identityId: "b799b044-16db-495a-b7e1-2cf3175d4b54",
    installationId: "12be09f5-fcd4-438f-9b5d-dc1fb11e5e75",
    macAddress: "0B:ED:A0:D5:5A:2D",
    name: "Test Device Name",
    os: "iPhone OS",
    platform: "iPhone",
    publicKey:
      "-----BEGIN RSA PUBLIC KEY-----\n" +
      "MIGJAoGBAKdVz2lIbQi1YU3Z0qRizpV9gAMW9Kmwms4aP+r7CKcu4w9/fMcV4v6P\n" +
      "zYHwnjvTEZ6gSqtxcpwT6EgBAgxFolqjeInOis2I+tcfxcShwcfMZ/E7kgktP15w\n" +
      "dsAFDTzmso9VtnBNgbt8afNea1nK25Fa+Zq+gztxkI5pkw1WFm4FAgMBAAE=\n" +
      "-----END RSA PUBLIC KEY-----\n",
    uniqueId: "27a10522a6994bbca0e1fc666804b350",
    ...options,
  });
