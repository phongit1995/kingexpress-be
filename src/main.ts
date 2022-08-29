import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './common/config/config.validate';
import { setUpSwagger } from './swagger';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  const configService =
    app.get<ConfigService<EnvironmentVariables>>(ConfigService);
  app.use(morgan('dev'));
  app.enableCors({
    origin: '*',
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe,Access-Control-Allow-Headers,Origin,Authorization',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
  });
  const PORT = configService.get('PORT') || 3000;
  setUpSwagger(app);
  await app.listen(PORT);
  console.log('App running on port : ' + PORT);
}
bootstrap();
