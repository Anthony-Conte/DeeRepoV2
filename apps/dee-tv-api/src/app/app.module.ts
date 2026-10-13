import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosModule } from './videos/videos.module';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    VideosModule,
    ChannelsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
