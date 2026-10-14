export interface Episode {
  id: string;
  title: string;
  path: string;
  url: string;
}

export type Schedule = Episode[];

export interface Channel {
  id: string;
  name: string;
  episodeCount: number;
  nowPlaying: string;
  nextChangeAt: string;
}

export interface ChannelProgram {
  channelId: string;
  channelName: string;
  episode: Episode & { durationSeconds: number };
  startSeconds: number;
  generatedAt: string;
  programStartedAt: string;
  nextChangeAt: string;
}

export interface NextChannelEpisode {
  channelId: string;
  channelName: string;
  episode: Episode;
  startSeconds: 0;
}
