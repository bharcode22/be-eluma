import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { TypePropertyModule } from './type-property/type-property.module';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    TypePropertyModule,
    PropertyModule,
  ],
  controllers: [
    UsersController 
  ],
  providers: [
    UsersService
  ],
})
export class AppModule {}
