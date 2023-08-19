import Joi from 'joi'

export const BaseJoiStringSchema = Joi.string()
export const buildJoiObjectSchema = (object: any) => Joi.object(object)
