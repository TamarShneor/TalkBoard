import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();



  const config = new DocumentBuilder()
  .setTitle('Talk Board')
  .setDescription('Forum management platform')
  .setVersion('1.0')
  .addTag('user')
  .addTag('forum')
  .addTag('message')
  .addTag('sendgrid')
  .addTag('customer')

  .addBearerAuth(
    { 
      description: `[just text field] Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'apiKey',
      in: 'Header'
    },
    'access-token',
  )
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('swagger', app, document);



  await app.listen(3000);
}
bootstrap();
