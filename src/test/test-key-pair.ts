import { Algorithm, KeyPair, KeyType, NamedCurve } from "@lindorm-io/key-pair";

export const getTestKeyPairEC = (): KeyPair =>
  new KeyPair({
    id: "7531da89-12e9-403e-925a-5da49100635c",
    algorithms: [Algorithm.ES512],
    allowed: new Date("2020-01-01T08:00:00.000Z"),
    created: new Date("2020-01-01T08:00:00.000Z"),
    namedCurve: NamedCurve.P521,
    privateKey:
      "-----BEGIN PRIVATE KEY-----\n" +
      "MIHuAgEAMBAGByqGSM49AgEGBSuBBAAjBIHWMIHTAgEBBEIBGma7xGZpaAngFXf3\n" +
      "mJF3IxZfDpI+6wU564K+eehxX104v6dZetjSfMx0rvsYX/s6cO2P3GE7R95VxWEk\n" +
      "+f4EX0qhgYkDgYYABAB8cBfDwCi41G4kVW4V3Y86nIMMCypYzfO8gYjpS091lxkM\n" +
      "goTRS3LM1p65KQfwBolrWIdVrbbOILASf06fQsHw5gEt4snVuMBO+LS6pesX9vA8\n" +
      "QT1LjX75Xq2InnLY1VToeNmxkuM+oDZgqHOYwzfUhu+zZaA5AuEkqPi47TA9iCSY\n" +
      "VQ==\n" +
      "-----END PRIVATE KEY-----\n",
    publicKey:
      "-----BEGIN PUBLIC KEY-----\n" +
      "MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQAfHAXw8AouNRuJFVuFd2POpyDDAsq\n" +
      "WM3zvIGI6UtPdZcZDIKE0UtyzNaeuSkH8AaJa1iHVa22ziCwEn9On0LB8OYBLeLJ\n" +
      "1bjATvi0uqXrF/bwPEE9S41++V6tiJ5y2NVU6HjZsZLjPqA2YKhzmMM31Ibvs2Wg\n" +
      "OQLhJKj4uO0wPYgkmFU=\n" +
      "-----END PUBLIC KEY-----\n",
    type: KeyType.EC,
  });

export const getTestKeyPairRSA = (): KeyPair =>
  new KeyPair({
    id: "3f6ab288-7e0e-48b5-90ab-4684257ebe5e",
    algorithms: [Algorithm.RS256, Algorithm.RS384, Algorithm.RS512],
    allowed: new Date("2020-01-01T08:00:00.000Z"),
    created: new Date("2020-01-01T08:00:00.000Z"),
    passphrase: "",
    privateKey:
      "-----BEGIN ENCRYPTED PRIVATE KEY-----\n" +
      "MIIC3TBXBgkqhkiG9w0BBQ0wSjApBgkqhkiG9w0BBQwwHAQILo+vYp1sVzkCAggA\n" +
      "MAwGCCqGSIb3DQIJBQAwHQYJYIZIAWUDBAEqBBAH/kHULWxjfIfts06S+YgeBIIC\n" +
      "gDTn9aCl0ndo30oMZGxXPjulzWp5+GcdcyhmwS0BHN/xWxoE/hAZcNHMshIqRZkz\n" +
      "9Bt8Az9x8nn5EHBp9DjrK/iC8sftrHwqCZuyeG07kZnHGkScAndGPGixHDOPmGhR\n" +
      "PMTA6VdS/BPojLf4avdA++pwqe9jgKfU7EIHZzVQibFJfNt0R8kNlDd9hlc8efiM\n" +
      "UfRbD+KgX0fRISoFxPWHBS7RCg/RczC2RQ7WtAUviD7sc9OzK0x8oUmr6gf/NDYD\n" +
      "pTYU4LUzFHc2FrXN5N0/w/1l7nzCTCuSo2w/2tx5eB6vD/oA6r+7KMzhG94aCeIJ\n" +
      "Rw6g1Be1Bgdqy8ijq1JMp3Tb7rkfRPf64OPHiUcXYi7A2G3EaofYgj8geaXNiDSf\n" +
      "t6kRPI5as27N8n1oOXb+8++kDuYU+T7lnBu3eprx+J0UMXKKdGWMfppOuCELaZEK\n" +
      "cO9JOcZQdXNWmFpmiSeGSsREAeNQp+wM8gkN6fJSlxCR4zjEP7z6dwl8sInEdTks\n" +
      "w6HoCmSgFohkcAmfLjPnNWGXEdkaAx0fnXia1V1OCccnHR+r/FnuKmkFjj8oPNmL\n" +
      "k86Y+YwTwzOAX56qRoiDevBqWScEy0GedYLAkjv5KwM+pajVjFEliXZ+BmMOGMgx\n" +
      "YuTg02HZfsAy90YuyWaBdxLLRcXcH4CIqbd83OVx+ostDFHN7wrfczgo5tDFiAp4\n" +
      "iBpuohVw7dDqxgzJ875v62ErYzTN00UddRFyy7L11duo3kmrbXzmeQ8qQ1J3RZxQ\n" +
      "B+S+46BStdGJfc8tDX7G4yhH6GUracFD9a6Uk4r4shj0emlU44NZR9V90xejwq2A\n" +
      "g3oTzDTCesmOzSew3oD8who=\n" +
      "-----END ENCRYPTED PRIVATE KEY-----\n",
    publicKey:
      "-----BEGIN RSA PUBLIC KEY-----\n" +
      "MIGJAoGBAMpaNgFfgnUINKdxyxjlZs3L0GBjcW7qqwtzBAAMgdJWcEo7Z8flDNGy\n" +
      "rvl8GarL3tkwoBcpUyi1/awyHpHeRMSLgKOnwMeMenK99TzeU4UWPX9ZXIQ4KxWE\n" +
      "tWWfrWyCckHTDgGD/gvpM5ygkHbhru8nu0pMZNI1N5GW5bMgmX1tAgMBAAE=\n" +
      "-----END RSA PUBLIC KEY-----\n",
    type: KeyType.RSA,
  });
