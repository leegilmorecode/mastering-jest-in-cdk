import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';

interface SimpleTableProps
  extends Pick<dynamodb.TableProps, 'partitionKey' | 'tableName' | 'sortKey'> {
  /**
   * The stage name which the dynamodb table is being used with
   */
  stageName: string;
  /**
   * The partition key attribute for the table
   */
  partitionKey: dynamodb.Attribute;
}

type FixedSimpleTableProps = Omit<
  dynamodb.TableProps,
  'partitionKey' | 'sortKey'
>;

export class SimpleTable extends Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: SimpleTableProps) {
    super(scope, id);

    const fixedProps: FixedSimpleTableProps = {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: props.stageName === 'prod' ? true : false,
      contributorInsightsEnabled: props.stageName === 'prod' ? true : false,
      tableName: props.tableName ? props.tableName : `${id}-${props.stageName}`,
      removalPolicy:
        props.stageName === 'prod'
          ? RemovalPolicy.RETAIN
          : RemovalPolicy.DESTROY,
    };

    this.table = new dynamodb.Table(this, id, {
      // fixed props
      ...fixedProps,
      // custom props
      ...props,
    });
  }
}
