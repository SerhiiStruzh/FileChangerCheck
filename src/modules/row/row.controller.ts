import { Controller, Get, Post, Body, NotFoundException, Res, HttpStatus, Param } from "@nestjs/common";
import { RowService } from "./row.service";
import { Row } from "src/repositories/row.repository"; 
import { RowDto } from "src/dto/row.dto"; 
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from 'express';

@ApiTags('rows') 
@Controller('rows')
export class RowController {
    constructor(private readonly rowService: RowService) {}

    @Post()
    @ApiBody({ type: RowDto }) 
    @ApiResponse({ status: 200, description: 'Row updated successfully.' })
    @ApiResponse({ status: 201, description: 'Row created successfully.' })
    async upsertRow(@Body() rowDto: RowDto, @Res() res: Response): Promise<Response> {
        const { cell, value, sheet } = rowDto;

        try {
            const existingRow = await this.rowService.findRowById(cell);
            const updatedRow = await this.rowService.updateRow(cell, value, sheet);
            return res.status(HttpStatus.OK).json(updatedRow);
        } catch (error) {
            if (error instanceof NotFoundException) {
                const newRow = await this.rowService.createRow(cell, value, sheet);
                return res.status(HttpStatus.CREATED).json(newRow); 
            }
            throw error;
        }
    }

    @Get()
    @ApiResponse({ status: 200, description: 'List of all rows retrieved successfully.' })
    async findAll(): Promise<Row[]> {
        return this.rowService.findAllRows();
    }

    @Get('/:cell')
    @ApiResponse({ status: 200, description: 'Row retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Row not found.' })
    findById(@Param('cell') cell: string): Promise<Row> {
        return this.rowService.findRowById(cell);
    }
}