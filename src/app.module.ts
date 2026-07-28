import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
import { FavoritePropertiesModule } from './favorite-properties/favorite-properties.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PropertyManagementModule } from './property-management/property-management.module';
import { UsersManagementModule } from './users-management/users-management.module';
import { PropertyOwnerModule } from './property-owner/property-owner.module';
import { ContactModule } from './contact/contact.module';
import { ServiceModule } from './service/service.module';
import { ServiceUserModule } from './service-user/service-user.module';
import { SayHalloModule } from './say-hallo/say-hallo.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'propertyImages'),
      serveRoot: '/propertyImages',
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'serviceImages'),
      serveRoot: '/serviceImages',
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    PrismaModule,
    AuthModule,
    TypePropertyModule,
    PropertyModule,
    ImagesModule,
    GeneralAreaModule,
    FavoritePropertiesModule,
    DashboardModule,
    PropertyManagementModule,
    UsersManagementModule,
    PropertyOwnerModule,
    ContactModule,
    ServiceModule,
    ServiceUserModule,
    SayHalloModule,
  ],
  controllers: [
    UsersController
  ],
  providers: [
    UsersService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
