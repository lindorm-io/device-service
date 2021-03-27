import { Algorithm, KeyPair, KeyType } from "@lindorm-io/key-pair";

export const getTestKeyPairEC = (): KeyPair =>
  new KeyPair({
    algorithm: Algorithm.ES512,
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
    algorithm: Algorithm.RS512,
    passphrase: "",
    privateKey:
      "-----BEGIN RSA PRIVATE KEY-----\n" +
      "Proc-Type: 4,ENCRYPTED\n" +
      "DEK-Info: AES-256-CBC,463B8AD046409577DCA5681511756D10\n" +
      "\n" +
      "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\n" +
      "-----END RSA PRIVATE KEY-----\n",
    publicKey:
      "-----BEGIN RSA PUBLIC KEY-----\n" +
      "MIICCgKCAgEAuzcW4WhUbxjchE+neKMjBXlzdg463PrqP5LfqtUMC6IDs1T2zj5P\n" +
      "FgdwPCU8xg4CTL/8nKa+Z7SXTqL0elZVcEJ8WsS7XegO+MES138udS873P/YszvZ\n" +
      "5CY5Ql+/p39vATSMVJhtKqmglu47p4uzU6gl5P10hzBR1v7zQx70x4QA8TQxpg3O\n" +
      "NHwX6mxbk4v9yY10mxUQ3PdktuQ4lL+toYgXjwMztdDEp9WuLi+kqurinwIbFf3t\n" +
      "jJTRKxQf9oFfVupMQwgHng2r6SLOvR/k6Rt5/mTJ9ocH1KVfNKadNeIohQs4tm26\n" +
      "dxR1t7EVXz8m8NS+ivlGWhd8cRVrFgZt2mKQfPLYFd4kxzli9Me6+NQp4JqCH4Kz\n" +
      "lOHPvTxPtbalhKPOp9XIU97UuVvqqWK29vNgi8Gm4ecjUBsPp6re3qWQGld/22Gu\n" +
      "GXboaEoKVF8jMoUOj93GmMKANecEmAlTpAssmrznlV1xSas6jzFrPwJllOUbzFxK\n" +
      "OYW9qerNEjwKQBta7cN1AKKq42t5xCTwXqeQYHRjHBNq9SOaOvo9eCG95w0yZEzq\n" +
      "hzAq4PPe2gqCUWR1tPnxRi+tGqbVPIcVwhRAF6Oks2C4Ab+402d71EhwdQcmYyT/\n" +
      "qqiSMKV99/R2sUmKOZjjW5Xv/OzIkepa5yjfYp5trsU6Pctbtnh0IZ8CAwEAAQ==\n" +
      "-----END RSA PUBLIC KEY-----\n",
    type: KeyType.RSA,
  });
