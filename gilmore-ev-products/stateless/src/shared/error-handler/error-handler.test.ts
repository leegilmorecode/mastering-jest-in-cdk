import { ResourceNotFoundError } from '@errors/resource-not-found';
import { ValidationError } from '@errors/validation-error';
import createError from 'http-errors';
import { errorHandler } from './error-handler';
import { logger } from '@shared';

jest.mock('@shared/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('error-handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle ValidationError', () => {
    const error = new ValidationError('Validation failed');
    error.name = 'ValidationError';

    try {
      errorHandler(error);
    } catch (e) {
      expect(e).toBeInstanceOf(createError.BadRequest);
    }

    expect(logger.error).toHaveBeenCalledWith(
      'private error: ValidationError: Validation failed'
    );
    expect(logger.error).toHaveBeenCalledWith('Validation failed', {
      errorName: 'Validation failed',
      statusCode: 400,
    });
  });

  it('should handle ResourceNotFound', () => {
    const error = new ResourceNotFoundError('Resource Not Found');
    error.name = 'ResourceNotFound';

    try {
      errorHandler(error);
    } catch (e) {
      expect(e).toBeInstanceOf(createError.NotFound);
    }

    expect(logger.error).toHaveBeenCalledWith(
      'private error: ResourceNotFound: Resource Not Found'
    );
    expect(logger.error).toHaveBeenCalledWith('Resource Not Found', {
      errorName: 'Resource Not Found',
      statusCode: 404,
    });
  });

  it('should handle unknown errors', () => {
    const error = new Error('Unknown Error');
    error.name = 'Unknown Error';

    try {
      errorHandler(error);
    } catch (e) {
      expect(e).toBeInstanceOf(createError.InternalServerError);
    }

    expect(logger.error).toHaveBeenCalledWith(
      'private error: Unknown Error: Unknown Error'
    );
    expect(logger.error).toHaveBeenCalledWith('An error has occurred', {
      errorName: 'An error has occurred',
      statusCode: 500,
    });
  });
});
