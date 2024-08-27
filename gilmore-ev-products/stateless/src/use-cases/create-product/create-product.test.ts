import { Product } from '@dto/product';
import { createProductUseCase } from './create-product';
import { logger } from '@shared/logger';
import { upsert } from '@adapters/secondary/dynamodb-adapter';

jest.mock('@shared/logger');
jest.mock('@adapters/secondary/dynamodb-adapter');

let newProduct: Product;

describe('create-product-use-case', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 1, 1));
  });

  beforeEach(() => {
    jest.clearAllMocks();

    newProduct = {
      name: 'QuickCharge Station',
      description: 'Fast charging station for electric vehicles',
      price: 2000,
      category: 'Charger',
      available: true,
      specifications: {
        powerOutput: 150,
        type: 'DC Fast Charger',
        connectorType: 'CCS',
      },
    };
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should create a product successfully', async () => {
    // arrange / act
    (upsert as jest.Mock).mockResolvedValue(newProduct);
    const product = await createProductUseCase(newProduct);

    // assert
    expect(product).toMatchSnapshot();
  });

  it('should log an error on failure', async () => {
    expect.assertions(2);

    // arrange
    const error = new Error('Unhandled error');
    (upsert as jest.Mock).mockRejectedValue(error);

    // act / assert
    await expect(createProductUseCase(newProduct)).rejects.toThrow(
      'Unhandled error'
    );
    expect(logger.error).toHaveBeenCalledWith(
      'Create Product Error: Unhandled error'
    );
  });

  it('should throw an error if price is over £10K in category charger', async () => {
    // arrange
    newProduct.price = 200000; // Note: in our business logic this can only be 10K max for category charger

    // act / assert
    await expect(createProductUseCase(newProduct)).rejects.toThrow(
      'Product price of 200000 is out of range'
    );
  });
});
