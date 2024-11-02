import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RowDto {
    @ApiProperty({
        description: 'The unique identifier for the cell in the row',
        example: 'A32',
    })
    @IsString()
    cell: string;

    @ApiProperty({
        description: 'The value associated with the cell',
        example: 'Sample Value',
    })
    @IsString()
    value: string;

    @ApiProperty({
        description: 'The name of the sheet this row belongs to',
        example: 'Sheet1',
    })
    @IsString()
    sheet: string;
}