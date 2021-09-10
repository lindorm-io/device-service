import { CertificateMethod } from "../../enum";
import { createSign } from "crypto";

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

export const signTestChallenge = (
  method: CertificateMethod,
  challenge: string,
): string => {
  const worker = createSign(method);
  worker.write(challenge);
  worker.end();

  return worker.sign({ key: privateKey, passphrase: "" }, "base64");
};
