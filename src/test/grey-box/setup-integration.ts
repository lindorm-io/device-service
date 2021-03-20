import { Algorithm, KeyPair, KeyPairHandler, Keystore, KeyType } from "@lindorm-io/key-pair";
import { BEARER_TOKEN_MW_OPTIONS } from "../../config";
import { DeviceRepository } from "../../infrastructure";
import { TokenIssuer } from "@lindorm-io/jwt";
import { getGreyBoxRepository } from "./mongo";
import { TEST_KEY_PAIR_EC, TEST_KEY_PAIR_RSA } from "./key-pair";
import { inMemoryKeys } from "./in-memory";
import { winston } from "../../logger";

export let TEST_DEVICE_REPOSITORY: DeviceRepository;

export let TEST_ACCOUNT_ID: string;

export let TEST_ISSUER: TokenIssuer;
export let TEST_KEY_PAIR_HANDLER: KeyPairHandler;

export const setupIntegration = async (): Promise<void> => {
  const { device } = await getGreyBoxRepository();

  TEST_DEVICE_REPOSITORY = device;

  TEST_ACCOUNT_ID = "51cc7c03-3f86-44ae-8be2-5fcf5536c08b";

  inMemoryKeys.push(
    new KeyPair({
      algorithm: Algorithm.ES512,
      privateKey: TEST_KEY_PAIR_EC.privateKey,
      publicKey: TEST_KEY_PAIR_EC.publicKey,
      type: KeyType.EC,
    }),
  );

  TEST_ISSUER = new TokenIssuer({
    issuer: BEARER_TOKEN_MW_OPTIONS.issuer,
    keystore: new Keystore({
      keys: inMemoryKeys,
    }),
    logger: winston,
  });
  TEST_KEY_PAIR_HANDLER = new KeyPairHandler({
    algorithm: "RS512",
    passphrase: "",
    privateKey: TEST_KEY_PAIR_RSA.privateKey,
    publicKey: null,
  });
};
