/**
 * Base interface for all commands
 * Commands represent actions that change the state of the system
 */
export interface ICommand {
  readonly commandId: string;
  readonly timestamp: Date;
}

/**
 * Base interface for command handlers
 * Handlers process commands and execute the corresponding business logic
 */
export interface ICommandHandler<TCommand extends ICommand, TResult = void> {
  handle(command: TCommand): Promise<TResult>;
}
