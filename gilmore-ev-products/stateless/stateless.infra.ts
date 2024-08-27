import * as cdk from 'aws-cdk-lib';

import { Match, Template } from 'aws-cdk-lib/assertions';

import { GilmoreEvProductsStatefulStack } from '../stateful/stateful';
import { GilmoreEvProductsStatelessStack } from './stateless';

describe('stateless-stack', () => {
  describe('in production', () => {
    let template: Template;

    beforeEach(() => {
      const app = new cdk.App();

      const statefulStack = new GilmoreEvProductsStatefulStack(
        app,
        'StatefulStack',
        {
          stage: 'prod',
        }
      );

      const statelessStack = new GilmoreEvProductsStatelessStack(
        app,
        'StatelessStack',
        {
          stage: 'prod',
          table: statefulStack.table,
        }
      );

      template = Template.fromStack(statelessStack);
    });

    describe('lambda-function', () => {
      it('should have the correct properties set', () => {
        template.hasResourceProperties('AWS::Lambda::Function', {
          FunctionName: 'create-product-lambda-prod',
          MemorySize: 1024,
          Environment: {
            Variables: {
              POWERTOOLS_SERVICE_NAME: 'gilmore-ev-service-prod',
              POWERTOOLS_METRICS_NAMESPACE: 'gilmore-ev-prod',
              TABLE_NAME: Match.anyValue(),
            },
          },
        });
      });
    });
  });

  describe('in non-production', () => {
    let template: Template;

    beforeEach(() => {
      const app = new cdk.App();

      const statefulStack = new GilmoreEvProductsStatefulStack(
        app,
        'StatefulStack',
        {
          stage: 'dev',
        }
      );

      const statelessStack = new GilmoreEvProductsStatelessStack(
        app,
        'StatelessStack',
        {
          stage: 'dev',
          table: statefulStack.table,
        }
      );

      template = Template.fromStack(statelessStack);
    });

    describe('lambda-function', () => {
      it('should have the correct properties set', () => {
        template.hasResourceProperties('AWS::Lambda::Function', {
          FunctionName: 'create-product-lambda-dev',
          MemorySize: 512,
          Environment: {
            Variables: {
              POWERTOOLS_SERVICE_NAME: 'gilmore-ev-service-dev',
              POWERTOOLS_METRICS_NAMESPACE: 'gilmore-ev-dev',
              TABLE_NAME: Match.anyValue(),
            },
          },
        });
      });
    });
  });
});
