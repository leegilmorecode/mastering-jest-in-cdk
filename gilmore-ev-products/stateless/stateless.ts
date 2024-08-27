import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

import { Construct } from 'constructs';

interface GilmoreEvProductsStatelessStackProps extends cdk.StackProps {
  stage: string;
  table: dynamodb.Table;
}

export class GilmoreEvProductsStatelessStack extends cdk.Stack {
  private table: dynamodb.Table;

  constructor(
    scope: Construct,
    id: string,
    props: GilmoreEvProductsStatelessStackProps
  ) {
    super(scope, id, props);

    const { stage, table } = props;

    this.table = table;

    const lambdaPowerToolsConfig = {
      LOG_LEVEL: 'DEBUG',
      POWERTOOLS_LOGGER_LOG_EVENT: 'true',
      POWERTOOLS_LOGGER_SAMPLE_RATE: '1',
      POWERTOOLS_TRACE_ENABLED: 'enabled',
      POWERTOOLS_TRACER_CAPTURE_HTTPS_REQUESTS: 'captureHTTPsRequests',
      POWERTOOLS_SERVICE_NAME: `gilmore-ev-service-${stage}`,
      POWERTOOLS_TRACER_CAPTURE_RESPONSE: 'captureResult',
      POWERTOOLS_METRICS_NAMESPACE: `gilmore-ev-${stage}`,
    };

    const createProductLambda: nodeLambda.NodejsFunction =
      new nodeLambda.NodejsFunction(this, 'CreateProductLambda', {
        functionName: `create-product-lambda-${stage}`,
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(
          __dirname,
          './src/adapters/primary/create-product/create-product.adapter.ts'
        ),
        memorySize: stage === 'prod' ? 1024 : 512,
        handler: 'handler',
        environment: {
          ...lambdaPowerToolsConfig,
          TABLE_NAME: this.table.tableName,
        },
      });

    // allow the lambda function to create products in the table
    this.table.grantWriteData(createProductLambda);

    // create the api to allow us to create a new product
    const api: apigw.RestApi = new apigw.RestApi(this, 'Api', {
      description: `clothing ev products api ${stage}`,
      restApiName: `clothing-ev-products-api-${stage}`,
      deploy: true,
      deployOptions: {
        stageName: 'api',
        dataTraceEnabled: true,
        loggingLevel: apigw.MethodLoggingLevel.INFO,
        tracingEnabled: true,
        metricsEnabled: true,
      },
    });

    const apiRoot: apigw.Resource = api.root.addResource('v1');
    const ordersResource: apigw.Resource = apiRoot.addResource('products');

    ordersResource.addMethod(
      'POST',
      new apigw.LambdaIntegration(createProductLambda, {
        proxy: true,
      })
    );
  }
}
