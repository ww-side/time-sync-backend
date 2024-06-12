import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @MinLength(1)
  readonly title: string;

  @IsNotEmpty()
  readonly icon_name: string;

  @IsOptional()
  readonly content: string;
}
