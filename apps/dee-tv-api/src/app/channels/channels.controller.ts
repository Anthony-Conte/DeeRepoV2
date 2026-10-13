import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Channel, ChannelProgram } from './channel.model';
import { ChannelsService } from './channels.service';

@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  findAll(): Promise<Channel[]> {
    return this.channelsService.findAll();
  }

  @Get(':channelId/now')
  findNow(@Param('channelId') channelId: string): Promise<ChannelProgram> {
    return this.channelsService.findNow(channelId);
  }
}
