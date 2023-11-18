import Joi, {SchemaMap} from 'joi'

export const BaseStringSchema = Joi.string()
export const buildObjectSchema = (object: SchemaMap) => Joi.object(object)
