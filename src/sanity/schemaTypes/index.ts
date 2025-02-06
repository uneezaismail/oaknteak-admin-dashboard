import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import { category } from './category'
import { order } from './order'
import { customer } from './customer'
import { review } from './review'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product,category,order,customer,review],
}
