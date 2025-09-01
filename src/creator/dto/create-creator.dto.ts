import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateCreatorDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNumber()
  @Min(0)
  monthlyPrice: number;
}
