import { Module } from '@nestjs/common';
import { RowController } from './row.controller';
import { RowService } from './row.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Row } from 'src/repositories/row.repository';
import { EmailModule } from '../email/email.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        SequelizeModule.forFeature([Row]),
        CacheModule.register(),
        EmailModule,
    ],
    controllers: [RowController],
    providers: [RowService],
})
export class RowModule {}