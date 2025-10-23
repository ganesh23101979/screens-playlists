import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const playlistCreateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200).required(),
  itemUrls: Joi.array().items(Joi.string().uri()).max(10).optional()
});
