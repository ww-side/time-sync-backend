import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  @MinLength(3)
  readonly title: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  readonly location: string;

  @IsDateString()
  @IsNotEmpty()
  readonly start_date: string;

  @IsDateString()
  @IsNotEmpty()
  readonly end_date: string;
}
