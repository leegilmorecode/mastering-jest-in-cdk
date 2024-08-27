import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

import { SimpleTable } from './simple-table';
import { Template } from 'aws-cdk-lib/assertions';

let stack: cdk.Stack;

describe('SimpleTable', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
  });

  describe('when using default props without the optional props', () => {
    it('should create a dynamodb table with the correct properties', () => {
      // arrange
      new SimpleTable(stack, 'SimpleTable', {
        stageName: 'dev',
        partitionKey: {
          name: 'PK',
          type: dynamodb.AttributeType.STRING,
        },
        sortKey: {
          name: 'SK',
          type: dynamodb.AttributeType.STRING,
        },
      });

      // act
      const template = Template.fromStack(stack);

      const resource = template.findResources('AWS::DynamoDB::Table', {});

      // assert
      expect(resource).toMatchSnapshot();
    });
  });

  describe('when setting the stageName as production (prod)', () => {
    it('should create a dynamodb table with the correct properties', () => {
      // arrange
      new SimpleTable(stack, 'SimpleTable', {
        stageName: 'prod',
        partitionKey: {
          name: 'PK',
          type: dynamodb.AttributeType.STRING,
        },
        sortKey: {
          name: 'SK',
          type: dynamodb.AttributeType.STRING,
        },
      });

      // act
      const template = Template.fromStack(stack);

      const resource = template.findResources('AWS::DynamoDB::Table', {});

      // assert
      expect(resource).toMatchSnapshot();
    });

    it('should allow us to override the default table name property', () => {
      // arrange
      new SimpleTable(stack, 'SimpleTable', {
        stageName: 'prod',
        tableName: 'gilmore-ev-products-table-prod',
        partitionKey: {
          name: 'PK',
          type: dynamodb.AttributeType.STRING,
        },
      });

      // act
      const template = Template.fromStack(stack);

      // assert
      template.hasResourceProperties('AWS::DynamoDB::Table', {
        TableName: 'gilmore-ev-products-table-prod',
      });
    });
  });
});
