import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextWillSendResponse,
  GraphQLRequestListener,
} from '@apollo/server';
import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { GqlContext } from '../interfaces';

export class GqlLoggerPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger(GqlLoggerPlugin.name);

  async requestDidStart(
    requestContext: GraphQLRequestContext<BaseContext>,
  ): Promise<GraphQLRequestListener<BaseContext> | void> {
    const { request } = requestContext;
    const gqlContext = requestContext.contextValue as GqlContext | undefined;
    const start = Date.now();
    const requestId =
      request.http?.headers?.get('x-request-id') ??
      gqlContext?.req?.id?.toString() ??
      randomUUID();

    if (gqlContext) {
      gqlContext.requestId = requestId;
      if (gqlContext.req && !gqlContext.req.headers['x-request-id']) {
        gqlContext.req.headers['x-request-id'] = requestId;
      }
    }

    this.logger.log(`Request started: ${request.operationName}`, {
      requestId,
      variables: request.variables,
      query: request.query,
    });

    return {
      willSendResponse: async (
        responseContext: GraphQLRequestContextWillSendResponse<BaseContext>,
      ) => {
        const { response } = responseContext;
        response.http.headers.set('x-request-id', requestId);

        this.logger.log(`Request completed: ${request.operationName}`, {
          requestId,
          query: request.query,
          statusCode: response.http.status,
          durationMs: Date.now() - start,
        });
      },
    };
  }
}
