import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { MAX_QUERY_LENGTH } from './search.types';

export class SearchDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_QUERY_LENGTH)
  q!: string;
}
