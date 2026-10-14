import { IsInt, Min } from 'class-validator';

export class FibonacciDataMessage {
  @IsInt()
  @Min(1)
  iterations: number;
}
