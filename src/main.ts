import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './common/config/config.validate';
import { setUpSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService =
    app.get<ConfigService<EnvironmentVariables>>(ConfigService);
  const PORT = configService.get('PORT') || 3000;
  setUpSwagger(app);
  await app.listen(PORT);
  console.log('App running on port : ' + PORT);
}
bootstrap();
