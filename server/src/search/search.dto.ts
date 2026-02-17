import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { MAX_QUERY_LENGTH } from './search.types';

export class SearchDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_QUERY_LENGTH)
  @Transform(({ value }: { value: string }) => value.trim())
  q!: string;
}
