import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartamentoDto {
  @ApiProperty({ description: 'Nombre del departamento', example: 'Antioquia' })
  @IsNotEmpty()
  @IsString()
  nombre: string;


}
