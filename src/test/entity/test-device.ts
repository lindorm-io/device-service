import { Device, DeviceOptions } from "../../entity";
import { CertificateMethod } from "../../enum";
import { cryptoLayered } from "../../instance";
import { randomUUID } from "crypto";
import { getRandomString } from "@lindorm-io/core";

export const getTestDevice = async (
  options: Partial<DeviceOptions> = {},
): Promise<Device> =>
  new Device({
    biometry: await cryptoLayered.encrypt(
      "0KV2dMmKRp9xDHSmtJFsxblPg3xtCCq5n6q3EfrEA1XcYGfI9HPEX9w9GyQ949V3DEgntyGOW07OY2uPROxLd9YAmtFMZgfC0rIg18OdoKBmEa3gpWIvRAZ6J0pjsIHz",
    ),
    certificateMethod: CertificateMethod.SHA512,
    identityId: randomUUID(),
    installationId: randomUUID(),
    macAddress: "0B:ED:A0:D5:5A:2D",
    name: "Test Person's iPhone",
    os: "iPhone OS 13_5_1",
    pincode: await cryptoLayered.encrypt("123456"),
    platform: "iPhone",
    publicKey:
      "-----BEGIN RSA PUBLIC KEY-----\n" +
      "MIGJAoGBAKdVz2lIbQi1YU3Z0qRizpV9gAMW9Kmwms4aP+r7CKcu4w9/fMcV4v6P\n" +
      "zYHwnjvTEZ6gSqtxcpwT6EgBAgxFolqjeInOis2I+tcfxcShwcfMZ/E7kgktP15w\n" +
      "dsAFDTzmso9VtnBNgbt8afNea1nK25Fa+Zq+gztxkI5pkw1WFm4FAgMBAAE=\n" +
      "-----END RSA PUBLIC KEY-----\n",
    uniqueId: getRandomString(32),
    ...options,
  });
