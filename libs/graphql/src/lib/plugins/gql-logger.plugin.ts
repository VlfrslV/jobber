import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextWillSendResponse,
  GraphQLRequestListener,
} from '@apollo/server';
import { Logger } from '@nestjs/common';

export class GqlLoggerPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger(GqlLoggerPlugin.name);

  async requestDidStart(
    requestContext: GraphQLRequestContext<BaseContext>,
  ): Promise<GraphQLRequestListener<BaseContext> | void> {
    const { request } = requestContext;
    const start = Date.now();

    this.logger.log(`Request started: ${request.operationName}`, {
      headers: request?.http?.headers,
      variables: request.variables,
      query: request.query,
      start,
    });

    return {
      willSendResponse: async (
        responseContext: GraphQLRequestContextWillSendResponse<BaseContext>,
      ) => {
        const { response } = responseContext;
        const duration = Date.now() - start;
        this.logger.log(`Request completed: ${request.operationName}`, {
          query: request.query,
          statusCode: response.http.status,
          duration: `${duration}ms`,
        });
      },
    };
  }
}
