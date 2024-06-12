import { IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @MinLength(3)
  @IsOptional()
  readonly username: string;

  @MinLength(6)
  @IsOptional()
  readonly password: string;
}
