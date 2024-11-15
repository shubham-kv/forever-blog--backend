import Joi from 'joi'

export const BaseStringSchema = Joi.string()
export const buildObjectSchema = (object: any) => Joi.object(object)
