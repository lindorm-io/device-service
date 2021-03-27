import Joi from "@hapi/joi";
import { ChallengeStrategy } from "../enum";

export const JOI_EVENTS = Joi.array()
  .items(
    Joi.object({
      date: Joi.date().required(),
      name: Joi.string().required(),
      payload: Joi.object().required(),
    }),
  )
  .required();

export const JOI_STRATEGY = Joi.string()
  .valid(ChallengeStrategy.IMPLICIT, ChallengeStrategy.PIN, ChallengeStrategy.SECRET)
  .required();
