import Joi from "joi";

export const registerSchema = Joi.object({
	name: Joi.string().min(2).max(50).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	age: Joi.number().min(0).max(120).optional(),
})

export const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
})

export const createUserSchema = Joi.object({
	name: Joi.string().min(2).max(50).required(),
	email: Joi.string().email().required(),
  age: Joi.number().min(0).max(120).optional(),
  phoneNumber: Joi.number().min(0).max(13).optional(),
  userImage: Joi.string().optional(),
  username: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(6).max(15).required(),
}
);