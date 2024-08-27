import { Product } from '@dto/product';
import { schema } from './create-product.schema';
import { schemaValidator } from '@shared/schema-validator';

describe('ev-create-product-schema', () => {
  it('should validate a correct vehicle successfully', () => {
    const validVehicle: Product = {
      name: 'TeslaX Model S',
      description: 'High-performance luxury electric sedan',
      price: 89990,
      category: 'Vehicle',
      available: true,
      specifications: {
        range: 405,
        batteryCapacity: 100,
        topSpeed: 155,
        acceleration: 3.1,
        seatingCapacity: 5,
        drivetrain: 'AWD',
      },
    };

    expect(() => schemaValidator(schema, validVehicle)).not.toThrow();
  });

  it('should validate a correct battery successfully', () => {
    const validBattery: Product = {
      name: 'SuperCharge Battery Pack',
      description: 'High-capacity battery for electric vehicles',
      price: 15000,
      category: 'Battery',
      available: true,
      specifications: {
        capacity: 100,
        type: 'Lithium-Ion',
        weight: 500,
        voltage: 400,
        dimensions: {
          length: 1.5,
          width: 1.0,
          height: 0.3,
        },
      },
    };

    expect(() => schemaValidator(schema, validBattery)).not.toThrow();
  });

  it('should validate a correct charger successfully', () => {
    const validCharger: Product = {
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

    expect(() => schemaValidator(schema, validCharger)).not.toThrow();
  });

  it('should validate a correct accessory successfully', () => {
    const validAccessory: Product = {
      name: 'EV Cleaning Kit',
      description: 'Comprehensive cleaning kit for electric vehicles',
      price: 50,
      category: 'Accessory',
      available: true,
      specifications: {
        compatibility: ['TeslaX Model S', 'TeslaX Model 3', 'TeslaX Model X'],
        weight: 2,
        dimensions: {
          length: 0.3,
          width: 0.2,
          height: 0.1,
        },
      },
    };

    expect(() => schemaValidator(schema, validAccessory)).not.toThrow();
  });

  it('should throw an error for a missing property', () => {
    const invalidProduct: Product = {
      name: 'Invalid Product',
      description: 'This product is missing required fields',
      price: 1000,
      category: 'Vehicle',
      available: true,
      // missing 'specifications' field
    } as any;

    expect(() =>
      schemaValidator(schema, invalidProduct)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{"instancePath":"","schemaPath":"#/required","keyword":"required","params":{"missingProperty":"specifications"},"message":"must have required property 'specifications'"}]"`
    );
  });

  it('should throw an error for an incorrect data type', () => {
    const invalidProduct: Product = {
      name: 'Invalid Product',
      description: 'This product has a wrong data type',
      price: 'Not a number', // should be a number
      category: 'Vehicle',
      available: true,
      specifications: {
        range: 400,
        batteryCapacity: 100,
        topSpeed: 150,
        acceleration: 3.5,
        seatingCapacity: 5,
        drivetrain: 'AWD',
      },
    } as any;

    expect(() =>
      schemaValidator(schema, invalidProduct)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{"instancePath":"/price","schemaPath":"#/properties/price/type","keyword":"type","params":{"type":"number"},"message":"must be number"}]"`
    );
  });
});
