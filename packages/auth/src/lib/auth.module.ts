import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      global: false,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(configService.getOrThrow('JWT_EXPIRATION'))
        }
      })
    })
  ],
  controllers: [],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule]
})
export class JwtAuthModule {}
