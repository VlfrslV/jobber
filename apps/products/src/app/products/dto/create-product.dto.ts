import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsNumberString()
  price!: string;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsString()
  description?: string;
}
