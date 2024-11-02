import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Row } from 'src/repositories/row.repository';
import { EmailService } from '../email/email.service';
import { getEmailsOfFileAccessors } from 'src/utils/file-accessor.utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RowService {
    private rowCount: number = 1;

    constructor(
        @InjectModel(Row)
        private readonly rowRepository: typeof Row,
        private readonly emailService: EmailService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache 
    ) {}

    async createRow(cell: string, value: string, sheet: string): Promise<Row> {
        const newRow = await this.rowRepository.create({ cell, value, sheet });

        this.rowCount++;
        
        if (this.rowCount % +process.env.NUMBER_ROW_TO_SEND_MAIL === 0) {
            console.log('here');
            this.rowCount = 1;
            const allEmails = await getEmailsOfFileAccessors();
            await this.emailService.sendEmail(allEmails.join(', '), 'File changed', `Added ${process.env.NUMBER_ROW_TO_SEND_MAIL} new rows to the sheet!`);
        }

        await this.cacheManager.del(`row_${newRow.cell}`);

        return newRow;
    }

    async findAllRows(): Promise<Row[]> {
        return this.rowRepository.findAll();
    }

    async findRowById(cell: string): Promise<Row> {
        const cachedRow = await this.cacheManager.get<Row>(`row_${cell}`);
        if (cachedRow) {
            return cachedRow;
        }

        const row = await this.rowRepository.findByPk(cell);
        if (!row) {
            throw new NotFoundException(`Row with cell ${cell} not found`);
        }

        await this.cacheManager.set(`row_${cell}`, row);
        return row;
    }

    async updateRow(cell: string, value: string, sheet: string): Promise<Row> {
        const row = await this.findRowById(cell);
        
        if (!row) {
            throw new NotFoundException(`Row with cell ${cell} not found`);
        }

        row.cell = cell;
        row.value = value;
        row.sheet = sheet;

        await row.save();

        await this.cacheManager.del(`row_${cell}`);

        return row; 
    }
}
