export const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    price: {
      type: 'number',
    },
    category: {
      type: 'string',
      enum: ['Vehicle', 'Battery', 'Charger', 'Accessory'],
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    available: {
      type: 'boolean',
    },
    releaseDate: {
      type: 'string',
      format: 'date-time',
    },
    created: {
      type: 'string',
      format: 'date-time',
    },
    updated: {
      type: 'string',
      format: 'date-time',
    },
    specifications: {
      oneOf: [
        {
          type: 'object',
          properties: {
            range: {
              type: 'number',
            },
            batteryCapacity: {
              type: 'number',
            },
            topSpeed: {
              type: 'number',
            },
            acceleration: {
              type: 'number',
            },
            seatingCapacity: {
              type: 'integer',
            },
            drivetrain: {
              type: 'string',
              enum: ['FWD', 'RWD', 'AWD'],
            },
          },
          required: [
            'range',
            'batteryCapacity',
            'topSpeed',
            'acceleration',
            'seatingCapacity',
            'drivetrain',
          ],
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            capacity: {
              type: 'number',
            },
            type: {
              type: 'string',
              enum: ['Lithium-Ion', 'Solid-State', 'Other'],
            },
            weight: {
              type: 'number',
            },
            voltage: {
              type: 'number',
            },
            dimensions: {
              type: 'object',
              properties: {
                length: {
                  type: 'number',
                },
                width: {
                  type: 'number',
                },
                height: {
                  type: 'number',
                },
              },
              required: ['length', 'width', 'height'],
              additionalProperties: false,
            },
          },
          required: ['capacity', 'type', 'weight', 'voltage', 'dimensions'],
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            powerOutput: {
              type: 'number',
            },
            type: {
              type: 'string',
              enum: ['Level 1', 'Level 2', 'DC Fast Charger'],
            },
            connectorType: {
              type: 'string',
              enum: ['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla'],
            },
          },
          required: ['powerOutput', 'type', 'connectorType'],
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            compatibility: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            weight: {
              type: 'number',
            },
            dimensions: {
              type: 'object',
              properties: {
                length: {
                  type: 'number',
                },
                width: {
                  type: 'number',
                },
                height: {
                  type: 'number',
                },
              },
              additionalProperties: false,
            },
          },
          required: ['compatibility'],
          additionalProperties: false,
        },
      ],
    },
  },
  required: [
    'id',
    'name',
    'description',
    'price',
    'category',
    'available',
    'created',
    'updated',
    'specifications',
  ],
  additionalProperties: false,
};
