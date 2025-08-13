import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { TypePropertyModule } from './type-property/type-property.module';
import { PropertyModule } from './property/property.module';
import { ImagesModule } from './images/images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GeneralAreaModule } from './general-area/general-area.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'propertyImages'),
      serveRoot: '/propertyImages',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    TypePropertyModule,
    PropertyModule,
    ImagesModule,
    GeneralAreaModule,
  ],
  controllers: [
    UsersController 
  ],
  providers: [
    UsersService
  ],
})
export class AppModule {}
