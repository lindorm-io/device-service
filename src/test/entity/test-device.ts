import { Device, DeviceOptions } from "../../entity";
import { CertificateMethod } from "../../enum";
import { cryptoLayered } from "../../instance";

export const getTestDevice = async (
  options: Partial<DeviceOptions> = {},
): Promise<Device> =>
  new Device({
    id: "4bfbd305-8296-427e-b212-7f4999181e58",
    biometry: await cryptoLayered.encrypt(
      "0KV2dMmKRp9xDHSmtJFsxblPg3xtCCq5n6q3EfrEA1XcYGfI9HPEX9w9GyQ949V3DEgntyGOW07OY2uPROxLd9YAmtFMZgfC0rIg18OdoKBmEa3gpWIvRAZ6J0pjsIHz",
    ),
    certificateMethod: CertificateMethod.SHA512,
    identityId: "b799b044-16db-495a-b7e1-2cf3175d4b54",
    installationId: "12be09f5-fcd4-438f-9b5d-dc1fb11e5e75",
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
    uniqueId: "27a10522a6994bbca0e1fc666804b350",
    ...options,
  });
