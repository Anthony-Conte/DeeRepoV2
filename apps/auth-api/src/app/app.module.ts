import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { JwtAuthModule } from '@org/auth';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.AUTH_DB_HOST,
      port: Number(process.env.AUTH_DB_PORT),
      username: process.env.AUTH_DB_USER,
      password: process.env.AUTH_DB_PASS,
      database: process.env.AUTH_DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      logging: true
    }),
    AuthModule,
    JwtAuthModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService]
})
export class AppModule {}
