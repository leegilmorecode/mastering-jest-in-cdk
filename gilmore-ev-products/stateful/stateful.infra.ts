import * as cdk from 'aws-cdk-lib';

import { GilmoreEvProductsStatefulStack } from './stateful';
import { Template } from 'aws-cdk-lib/assertions';

describe('stateful-stack', () => {
  describe('dynamodb-table', () => {
    it('should create a dynamodb table with pitr as false if stage is dev', () => {
      const app = new cdk.App();

      // arrange
      const stack = new GilmoreEvProductsStatefulStack(app, 'StatefulStack', {
        stage: 'dev',
      });

      // act
      const template = Template.fromStack(stack);

      // assert
      template.hasResourceProperties('AWS::DynamoDB::Table', {
        PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: false },
        TableName: 'gilmore-ev-products-table-dev',
      });
    });

    it('should create a dynamodb table with pitr as true if stage is prod', () => {
      const app = new cdk.App();

      // arrange
      const stack = new GilmoreEvProductsStatefulStack(app, 'StatefulStack', {
        stage: 'prod',
      });

      // act
      const template = Template.fromStack(stack);

      // assert
      template.hasResourceProperties('AWS::DynamoDB::Table', {
        PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true },
        TableName: 'gilmore-ev-products-table-prod',
      });
    });

    it('should create a dynamodb table with removal policy as destroy if stage is dev', () => {
      const app = new cdk.App();

      // arrange
      const stack = new GilmoreEvProductsStatefulStack(app, 'StatefulStack', {
        stage: 'dev',
      });

      // act
      const template = Template.fromStack(stack);

      // assert
      const expectedTemplate = {
        Resources: {
          TableCD117FA1: {
            Type: 'AWS::DynamoDB::Table',
            DeletionPolicy: 'Delete',
            Properties: {
              TableName: 'gilmore-ev-products-table-dev',
            },
          },
        },
      };

      template.templateMatches(expectedTemplate);
    });

    it('should create a dynamodb table with removal policy as retain if stage is prod', () => {
      const app = new cdk.App();

      // arrange
      const stack = new GilmoreEvProductsStatefulStack(app, 'StatefulStack', {
        stage: 'prod',
      });

      // act
      const template = Template.fromStack(stack);

      // assert
      const expectedTemplate = {
        Resources: {
          TableCD117FA1: {
            Type: 'AWS::DynamoDB::Table',
            DeletionPolicy: 'Retain',
            Properties: {
              TableName: 'gilmore-ev-products-table-prod',
            },
          },
        },
      };

      template.templateMatches(expectedTemplate);
    });

    // note: the following two tests are to discuss the approach only, and do
    // crossover the tests above somewhat
    it('should match the snapshot if stage is dev', () => {
      const app = new cdk.App();

      // arrange
      const stack = new GilmoreEvProductsStatefulStack(app, 'StatefulStack', {
        stage: 'dev',
      });

      // act
      const template = Template.fromStack(stack);

      const resource = template.findResources('AWS::DynamoDB::Table', {
        Properties: {
          TableName: 'gilmore-ev-products-table-dev',
        },
      });

      // assert
      expect(resource).toMatchInlineSnapshot(`
{
  "TableCD117FA1": {
    "DeletionPolicy": "Delete",
    "Properties": {
      "AttributeDefinitions": [
        {
          "AttributeName": "id",
          "AttributeType": "S",
        },
      ],
      "BillingMode": "PAY_PER_REQUEST",
      "KeySchema": [
        {
          "AttributeName": "id",
          "KeyType": "HASH",
        },
      ],
      "PointInTimeRecoverySpecification": {
        "PointInTimeRecoveryEnabled": false,
      },
      "TableName": "gilmore-ev-products-table-dev",
    },
    "Type": "AWS::DynamoDB::Table",
    "UpdateReplacePolicy": "Delete",
  },
}
`);
    });

    it('should match the snapshot if stage is prod', () => {
      const app = new cdk.App();

      // arrange
      const stack = new GilmoreEvProductsStatefulStack(app, 'StatefulStack', {
        stage: 'prod',
      });

      // act
      const template = Template.fromStack(stack);

      const resource = template.findResources('AWS::DynamoDB::Table', {
        Properties: {
          TableName: 'gilmore-ev-products-table-prod',
        },
      });

      // assert
      expect(resource).toMatchInlineSnapshot(`
{
  "TableCD117FA1": {
    "DeletionPolicy": "Retain",
    "Properties": {
      "AttributeDefinitions": [
        {
          "AttributeName": "id",
          "AttributeType": "S",
        },
      ],
      "BillingMode": "PAY_PER_REQUEST",
      "KeySchema": [
        {
          "AttributeName": "id",
          "KeyType": "HASH",
        },
      ],
      "PointInTimeRecoverySpecification": {
        "PointInTimeRecoveryEnabled": true,
      },
      "TableName": "gilmore-ev-products-table-prod",
    },
    "Type": "AWS::DynamoDB::Table",
    "UpdateReplacePolicy": "Retain",
  },
}
`);
    });
  });
});
