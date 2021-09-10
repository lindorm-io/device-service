import { Keystore } from "@lindorm-io/key-pair";
import { getTestKeyPairEC } from "./test-key-pair";

export const getTestKeystore = (): Keystore =>
  new Keystore({
    keys: [getTestKeyPairEC()],
  });
