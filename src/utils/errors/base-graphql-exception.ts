import { GraphQLError } from 'graphql';

type ErrorMeta = Record<string, unknown>;

type BaseGraphQLExceptionOptions = {
  code: string;
  status: number;
  meta?: ErrorMeta;
};

class BaseGraphQLException extends GraphQLError {
  constructor(message: string, options: BaseGraphQLExceptionOptions) {
    const { code, status, meta } = options;

    super(message, {
      extensions: {
        code,
        http: {
          status,
        },
        ...(meta ? { meta } : {}),
      },
    });

    this.name = new.target.name;
  }
}

const isBaseGraphQLException = (error: unknown): error is BaseGraphQLException => error instanceof BaseGraphQLException;

export type { BaseGraphQLExceptionOptions, ErrorMeta };
export { BaseGraphQLException, isBaseGraphQLException };
