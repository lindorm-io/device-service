import { isExternalChallengeRequired } from "./is-external-challenge-required";

describe("enrolmentInitialiseController", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      metadata: {
        agent: {
          os: "os",
          platform: "platform",
        },
        device: {
          uniqueId: "uniqueId",
        },
      },
      repository: {
        deviceRepository: {
          findMany: jest.fn().mockResolvedValue([
            {
              os: "os",
              platform: "platform",
              uniqueId: "uniqueId",
            },
          ]),
        },
      },
    };
  });

  test("should resolve false", async () => {
    await expect(isExternalChallengeRequired(ctx, "identityId")).resolves.toBe(false);

    expect(ctx.repository.deviceRepository.findMany).toHaveBeenCalledWith({
      active: true,
      identityId: "identityId",
      trusted: true,
    });
  });

  test("should resolve true", async () => {
    ctx.repository.deviceRepository.findMany.mockResolvedValue([
      {
        os: "os",
        platform: "platform",
        uniqueId: "uniqueId",
      },
      {
        os: "other-os",
        platform: "other-platform",
        uniqueId: "other-uniqueId",
      },
    ]);

    await expect(isExternalChallengeRequired(ctx, "identityId")).resolves.toBe(true);
  });
});
