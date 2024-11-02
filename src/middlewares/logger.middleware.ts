import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const { method, url } = req;
        const start = Date.now();

        this.logger.log(`Request: ${method} ${url}`);

        res.on('finish', () => {
            this.logger.log(`Response: ${res.statusCode} ${method} ${url} `);
        });

        next();
    }
}