import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

import { Construct } from 'constructs';

export interface GilmoreEvProductsStatefulStackProps extends cdk.StackProps {
  stage: string;
}

export class GilmoreEvProductsStatefulStack extends cdk.Stack {
  public table: dynamodb.Table;

  constructor(
    scope: Construct,
    id: string,
    props: GilmoreEvProductsStatefulStackProps
  ) {
    super(scope, id, props);

    const { stage } = props;

    // create the table to store our products
    // Note: in reality we could have used our 'SimpleTable' construct'
    this.table = new dynamodb.Table(this, 'Table', {
      tableName: `gilmore-ev-products-table-${stage}`,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: stage === 'dev' ? false : true,
      removalPolicy:
        stage === 'dev' ? cdk.RemovalPolicy.DESTROY : cdk.RemovalPolicy.RETAIN,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });
  }
}
