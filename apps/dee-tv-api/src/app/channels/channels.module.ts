import { Module } from '@nestjs/common';
import { VideosModule } from '../videos/videos.module';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  imports: [VideosModule],
  controllers: [ChannelsController],
  providers: [ChannelsService]
})
export class ChannelsModule {}
