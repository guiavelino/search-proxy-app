import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SearchQueryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  q: string;
}

export class SearchBodyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  q: string;
}
