import convict = require('convict');

export const config = convict({
  tableName: {
    doc: 'The dynamodb products table',
    default: 'table',
    env: 'TABLE_NAME',
    nullable: false,
  },
});
