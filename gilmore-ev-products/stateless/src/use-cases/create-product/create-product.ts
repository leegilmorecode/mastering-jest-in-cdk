import { getISOString, logger, schemaValidator } from '@shared';

import { Product } from '@dto/product';
import { ValidationError } from '@errors/validation-error';
import { config } from '@config';
import { schema } from '@schemas/product';
import { upsert } from '@adapters/secondary/dynamodb-adapter';
import { v4 as uuid } from 'uuid';

const tableName = config.get('tableName');

export async function createProductUseCase(
  newProduct: Product
): Promise<Product> {
  try {
    const createdDate = getISOString();
    const id = uuid();

    const product: Product = {
      ...newProduct,
      id,
      created: createdDate,
      updated: createdDate,
    };

    schemaValidator(schema, product);

    // Note: we add this to show some business logic to unit test
    if (product.price > 10000 && product.category === 'Charger') {
      throw new ValidationError(
        `Product price of ${product.price} is out of range`
      );
    }

    await upsert<Product>(product, tableName, id);

    return product;
  } catch (error) {
    logger.error(`Create Product ${error}`);
    throw error;
  }
}
