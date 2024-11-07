import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateReviewDto {
  @IsNotEmpty()
  description: string

  @IsNotEmpty()
  expedientId: string

  @IsOptional()
  @IsDateString()
  createdAt?: string
}
