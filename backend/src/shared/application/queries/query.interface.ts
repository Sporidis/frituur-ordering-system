/**
 * Base interface for all queries
 * Queries represent read operations that don't change the state of the system
 */
export interface IQuery {
  readonly queryId: string;
  readonly timestamp: Date;
}

/**
 * Base interface for query handlers
 * Handlers process queries and return the requested data
 */
export interface IQueryHandler<TQuery extends IQuery, TResult> {
  handle(query: TQuery): Promise<TResult>;
}
