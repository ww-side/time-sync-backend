import { IsOptional, MinLength } from 'class-validator';

export class UpdateNoteDto {
  @IsOptional()
  @MinLength(1)
  readonly title: string;

  @IsOptional()
  @MinLength(1)
  readonly icon_name: string;

  @IsOptional()
  readonly content: string;
}
