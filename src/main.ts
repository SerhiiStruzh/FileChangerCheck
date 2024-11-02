import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, 
    transform: true,
  }));

  const config = new DocumentBuilder()
                    .setTitle('Google sheets file changes tracker')
                    .setDescription('The description API')
                    .setVersion('1.0')
                    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT);
  console.log(`Application is running on: port ${process.env.PORT}`);
}
bootstrap();

