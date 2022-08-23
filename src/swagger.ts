import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as basicAuth from 'express-basic-auth';
const SWAGGER_URL = 'swagger';
export function setUpSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('king express - api')
    .setDescription('king express - api')
    .addTag('king express - api')
    .setVersion('1.2')
    .addBearerAuth()
    .addTag('back end')
    .addServer('/')
    .addServer('https://api.docs.com')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'My API Docs',
  };
  if (process.env.NODE_ENV !== 'production') {
    app.use(
      ['/swagger'],
      basicAuth({
        challenge: true,
        users: {
          admin: 'admin',
        },
      }),
    );
    SwaggerModule.setup(SWAGGER_URL, app, document, customOptions);
  }
}
