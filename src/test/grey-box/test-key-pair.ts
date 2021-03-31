import { Algorithm, KeyPair, KeyType } from "@lindorm-io/key-pair";

export const getTestKeyPairEC = (): KeyPair =>
  new KeyPair({
    id: "74efb644-6c0b-4cd4-8ee8-6e776205b02d",
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
    id: "2dac5c16-a0ae-4010-9d2b-1b638150767e",
    algorithm: Algorithm.RS512,
    privateKey:
      "-----BEGIN RSA PRIVATE KEY-----\n" +
      "Proc-Type: 4,ENCRYPTED\n" +
      "DEK-Info: AES-256-CBC,D4A7B3206D6701750C3BA26CC87E21D9\n" +
      "\n" +
      "pKL9smPFfTCAZXBGH++GXvAr8nLa/evZ07vFT0sBoOQ3OBsds+5h0t/2pg+tfJ4h\n" +
      "6+E/E5LIjdsYf0GPEeFRZQaWD2uwoRcCXtHVbbRMtga7w++AIwEZNbxt5ALPv0wW\n" +
      "tDdCOliSit64Q/R/shuQIca3LknTbqrOIHz9TrIyuDcnq+7nx0iYexS/Ip4q6iuc\n" +
      "VKKOXraU6nfM/hQPtOIqKNqzTz34ijcf2XN740NXYrEmpPwGOAsVkgICnmB8sa5M\n" +
      "obV13o11iWR+An/dRYgY0O1SWGVfhBe9HLw6NJ/80xrW+5u08pIpGxC757KkijUV\n" +
      "WLIWGi0pGLXDcdx8wMnMh2y7cqO2q/JM6QNU/nYvPAwrnKFxDOVwcgHD5S8gRx5D\n" +
      "hVc+Y0OAGKhe/duY3ZdUkH4cng94DndmlX6lQr1aTdWTiZRAMHSTKyHVp0SueH3o\n" +
      "2dD08Ep//MqEH1j/EuqPqwBgPwMCS8y3zBh80s9Y9iU4jwBzYhfCxA+MA/dXmwrM\n" +
      "NQtRYHlp0qckiyw5YiDnsi3dWFcBHdHHBuMkZzyM/Y0/XBXytN2OZ039uAaMaWDV\n" +
      "YPisGBmOtQ2refdbQdlGdgTVc69NDxmcs36yzytlk4Is0euzUp7Tbb5oNmuRYEzD\n" +
      "Bc1ZOMJ7ySmSOW3IW8fs/OX4n+V6hSziB4KhHybekQPdPUfzutlQYd/xEyK1CaDe\n" +
      "ffM21cJ8elXyFMApUI6gjf0HBi3gUn2nE/g6NVUdN1fAK2Ah8ne6rfpvSfci57Ov\n" +
      "i9S3+xdCM/j8CDsq8OfRCEQiDvYscyh/alV3KE88sFpNIhNj5UjAmmOtgH+1R0j5\n" +
      "U5gNl/0QaTIB8LKeBq257PgiXjawq18/YSi0/sBUHNJ32nWrBLfg+MmZnIW9zweY\n" +
      "JhfDCjJtMpQj991a/WI90smb4C3hECgIqBDdLFS8xo5+5+5yuK+4u8YwedFOV6iq\n" +
      "uTeLdDWlBVDxHgbU0/4I2znZOjq1/YiOL0SQbXBZIj3VmBwuBpiANVxHsv/uoy7a\n" +
      "GCM3dogJmYKifwVDA5nSSEiwrqegwYCPejgYnoMBpv0t4bcP4YUx7jY4wlFZnmgY\n" +
      "cD9vPGK0gwghj4Oq5xO9eKYtXhDiuslNyGus1B97xNUz3TkIBdgE6giu7YTJI8eL\n" +
      "p6Gs0Cq+ZwlFsXEBZdI7bz6+UosvyqBq/BlsmXQlKFn5AOG0biSVVd4hGTCPTChn\n" +
      "sy9VTgYfUq2YtTqx0ebWC1W5eF9U39zIhk2ffOX0p+PFOGYtMWijguhfDvBi0l6m\n" +
      "KqLPFsfnYwlKE6U1/TSlfwZ95F09dLxrdvezRyrx+KEIJGebiZe2VU297KtkByZf\n" +
      "KF8tWBRDfvTGtlvA/TCHPaVu0pqDG+/jpjmS2Ll6cCtrpI4pCIcLz57rvEs6iTHW\n" +
      "IMGoOnJAUrm3W38Jd2klPkpZS6RdFuiy6RjZ5NkWkwfcNyerPc1Ldt+3A9oF77OC\n" +
      "p4UDCoYEVNA6kR6j9Dh8nFFEmO3hjjkt3dzg5MPUU3xuSAHR+aKhacoI7vmBK8Oa\n" +
      "Yx43/Ju+JzbKRwOPEu8+JuPBQqJZ8+qLsKvbRj3l1HXj5AVK4B1n2wQn+1IRCy+c\n" +
      "trSZK/bLacVX0cs5QEBtvFizVXun+e0I3wcl4V299KD8WG3SLqsVuiqPLW6AXw7R\n" +
      "643spIfemgJM9wkQTcoqrOE/AS6KTSSPUriuTkdp1gxbhlbwMVFs0ccWdP4ILyDR\n" +
      "nrlPIJvQdpQBtPgCcqcQr7T6ICCoITDIkLMvREfRayHvZX/fWhalJQLfL+alOE5T\n" +
      "t1ZZA8G4Lzy7J09PCv/bfB5dq8utYlpuaN7tMkvKZSB5/8wDRAx2uzKRQ09gXCPE\n" +
      "oIGOEYND8O7x0Lnms21S6A2yq5jq8mXwimpe3nHxdybGqALS0DruKGFZOQFq+VJe\n" +
      "3POYGjCaXD3jQxeYe5mexr+8iFLR7cQHh2PUhHgNOr2x3O0PqKf3QKMbvkzO+9U6\n" +
      "G9FVQBYL/LyN5UV/N+VmvrpHDjFUgoi6MbdsJi3th/skKNHb+ubwgXB7tE1pQpE+\n" +
      "ky31+0KdDDr8/mt5TXOSvC9pwtYkvbZRJuDkK91RqcziL7qcRrjeBfYmOoKBvEwM\n" +
      "31Nr7WJmTqt9X/g/w26ldPMpb+YTmpSaNH+1xXohz7ZOyXapr2dpDilOQHx+ioAq\n" +
      "7wHcW/JUg9gNtBbAG7nfNSBITDD81KOhYio2jY06qMZXNEd9PxXgUQiVSQnPOs/w\n" +
      "i9Su/R3ilDleuA9xbYLKlCUBvQbUceTM+Pg/U+Ry0HhfFlIGY35e8TA8SDSPh/p6\n" +
      "Od384OtUPtwjJbZEOofXI7xI3RhNASW7qFHRmiyDN2dJjuCUvEuxjOvsPRcg/v9o\n" +
      "UX2ivASuwniIkn+pyfw67MIDIqHnNXCU1ECEElhpzh9OlfJsbxwaemVcrgMJ135l\n" +
      "vY1Bk/16YV4I/oNcERbX3UO/qhjLkvwPUO8vy1SbVxXBcYcOSIR8zF1UgwAs4zim\n" +
      "GdCBgaHPJVEZZzxFK8Ad49mSMq876lHCRPsXUEuh1aRbYkKZGgM+4MsZP3bM3gYk\n" +
      "nmVxX3WXAfSk8iCTuHgE5wJDNAMcqLtPHyN+J8ZZ/rfu31o919vae3ptlUl0MXqd\n" +
      "hMTRNFr4GJQDj1cEvzYDnbW0GxUv7F4K9r8h0yV9RI7oRblG9i3xyqidjDzHXBMy\n" +
      "G35/wvd5nnSgRuaUcYGJg/Kc6OqTaNYAF2MduxQkhOZRYi5DAXBTl1GTx6stdlW7\n" +
      "6hiImnbXuh6hrcFIbY6IpaGYTBh6C7/Wp0B8HuE3t2Qo/p3gH3TH4JPzFRUtMTy9\n" +
      "+gcf49Nekt6CfWpRW/s7ZXEkEfFKTrrH0hSB4XZf8t5HL8KEE4DpzqrFTJcF0ul2\n" +
      "zTJyav+zInBrIadmOE9JBKQ86Vsj4k4yCLtqRUDr/1t13g6D2l16mmA2oeh+NTR1\n" +
      "7StGqlRXLAZTkgJKOsm/BU8wV0U7kpEK12oKRfbmnehfbdxo/Q9itnLzms94CFlP\n" +
      "vbZaxJ5dmCZRaran9lx0VSv+YplLAhaPazyS5Bs63goUridcMRP5E5RZzHEw/hTF\n" +
      "H+JhyWzZu1niffD9dwnGCUIdSW2R3ewxFANxp0Cx1sHM/rgXrHsXhbcILqeLQAd5\n" +
      "-----END RSA PRIVATE KEY-----\n",
    publicKey:
      "-----BEGIN RSA PUBLIC KEY-----\n" +
      "MIICCgKCAgEAs7ydT9Ndt1Idx9NE2zMhAcecJGUcIlbWeXEtZJA7aKZDDhxYaEGB\n" +
      "WZvX+GRndllnPrOgzoxukITGYvj88bnrGZVZX2ckjIVUR1NxDrhyMjqnn4yDz4UB\n" +
      "Q3Zqt6Gz6DcE+Y9ro6kyhu01KPMyUlhDQAUdwpIJA3saUJ5KZj6ai4NTuXbLqzly\n" +
      "+3H5TMQY4WjrQwj/KRuq8LBEsR4YGaiaFZjHaf5n8+s2Gim/dDgAbIsZS+lGTwgx\n" +
      "nigd7dKP9tG6q3GwNPNBSuuQh6rVbBKbmzBa5rO9SmeZ+HLUyClpzhZ+Hp8yOGAn\n" +
      "qQFZZnokJ6dhxDEQcxPV2HUsYpi3oYSSomXsLgYSja1VT7CgeBchWj07ux6MnagM\n" +
      "AB1+O7O2yzu0LYJc72BQOJaSIrBCh1FcPjM0KC1CPocux2JtqgDL/Td+V5HbLU9n\n" +
      "ZQQoYDcrK3ozSne9ojioUWEwdBEzQmj9e3Wei87EyLe5bn/6tDbg17R7ZlVy2iVs\n" +
      "IFziLHrv3VUIbESy5tTCdzK/qzFR0hlxejT12CTUSkN5eKmfz0pfzt+w8ldEfpws\n" +
      "lBUcoS4sBIR3urpvx1EKM1xaUHfchhIKnY5KGTEM+5rJVwlDq+3lLcrJI3AErTAX\n" +
      "gSR6fcZmKuI4nCfTKl3ykozcPwpEmfRgSBDHKwDJe6ZbK0sL4ScVookCAwEAAQ==\n" +
      "-----END RSA PUBLIC KEY-----\n",
    type: KeyType.RSA,
  });
