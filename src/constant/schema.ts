import Joi from "@hapi/joi";

export const JOI_EVENTS = Joi.array()
  .items(
    Joi.object({
      date: Joi.date().required(),
      name: Joi.string().required(),
      payload: Joi.object().required(),
    }),
  )
  .required();
