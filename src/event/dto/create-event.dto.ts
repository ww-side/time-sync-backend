import { IsDate, IsDateString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @MinLength(3)
  readonly title: string;

  readonly description: string;
  readonly location: string;

  @IsDateString()
  @IsNotEmpty()
  readonly start_date: string;

  @IsDateString()
  @IsNotEmpty()
  readonly end_date: string;
}
