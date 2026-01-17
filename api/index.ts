import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const expressApp = express();
let cachedApp;

async function bootstrap() {
    if (!cachedApp) {
        const app = await NestFactory.create(
            AppModule,
            new ExpressAdapter(expressApp),
        );
        app.enableCors({
            origin: true,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        });
        await app.init();
        cachedApp = app;
    }
    return cachedApp;
}

export default async (req, res) => {
    await bootstrap();
    return expressApp(req, res);
};
