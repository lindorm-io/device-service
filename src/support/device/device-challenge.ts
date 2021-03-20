import { KeyPairHandler } from "@lindorm-io/key-pair";
import { AssertDeviceChallengeError } from "../../error";
import { IKoaDeviceContext } from "../../typing";

export const assertDeviceChallenge = (ctx: IKoaDeviceContext) => (
  deviceChallenge: string,
  deviceVerifier: string,
): void => {
  const { device } = ctx;

  const handler = new KeyPairHandler({
    algorithm: "RS512",
    passphrase: "",
    privateKey: null,
    publicKey: device.publicKey,
  });

  try {
    handler.assert(deviceChallenge, deviceVerifier);
  } catch (err) {
    throw new AssertDeviceChallengeError(deviceChallenge, deviceVerifier);
  }
};
