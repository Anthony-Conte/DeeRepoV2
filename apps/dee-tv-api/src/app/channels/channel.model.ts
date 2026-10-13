import { VideoFile } from '../videos/video.model';

export interface Channel {
  id: string;
  name: string;
  episodeCount: number;
}

export interface ChannelProgram {
  channelId: string;
  channelName: string;
  episode: VideoFile & { durationSeconds: number };
  startSeconds: number;
  generatedAt: string;
  programStartedAt: string;
  nextChangeAt: string;
}
