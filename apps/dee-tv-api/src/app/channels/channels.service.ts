import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { Channel, ChannelEpisode, ChannelProgram } from './channel.model';
import { VideoFile } from '../videos/video.model';
import { VideosService } from '../videos/videos.service';

const execFileAsync = promisify(execFile);
const naturalOrder = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base'
});

@Injectable()
export class ChannelsService {
  private readonly ffprobePath: string;
  private readonly cycleEpochMs: number;
  private readonly durationCache = new Map<string, Promise<number>>();

  constructor(
    private readonly videosService: VideosService,
    configService: ConfigService
  ) {
    this.ffprobePath = configService.get<string>('FFPROBE_PATH') ?? 'ffprobe';
    const cycleEpoch =
      configService.get<string>('CHANNEL_CYCLE_EPOCH') ??
      '2020-01-01T00:00:00.000Z';
    this.cycleEpochMs = Date.parse(cycleEpoch);

    if (!Number.isFinite(this.cycleEpochMs)) {
      throw new Error('CHANNEL_CYCLE_EPOCH must be a valid ISO date.');
    }
  }

  async findAll(): Promise<Channel[]> {
    const groups = this.groupEpisodes(await this.videosService.findAll());
    const videos = [...groups.values()].flatMap(({ episodes }) => episodes);
    const episodesWithDurations = await this.withDurations(videos);
    const durationsById = new Map(
      episodesWithDurations.map((episode) => [
        episode.id,
        episode.durationSeconds
      ])
    );
    const nowMs = Date.now();

    return [...groups.values()].map(({ channel, episodes }) => {
      const scheduledEpisodes = episodes.map((episode) => ({
        ...episode,
        durationSeconds: durationsById.get(episode.id) ?? 0
      }));
      const currentProgram = this.getCurrentProgram(
        channel.id,
        channel.name,
        scheduledEpisodes,
        nowMs
      );

      return {
        ...channel,
        episodeCount: episodes.length,
        nowPlaying: currentProgram.episode.title
      };
    });
  }

  async findNow(channelId: string): Promise<ChannelProgram> {
    const groups = this.groupEpisodes(await this.videosService.findAll());
    const group = groups.get(channelId);

    if (!group) {
      throw new NotFoundException(`Channel "${channelId}" was not found.`);
    }

    const episodes = await this.withDurations(group.episodes);
    return this.getCurrentProgram(
      group.channel.id,
      group.channel.name,
      episodes,
      Date.now()
    );
  }

  async findNext(
    channelId: string,
    afterEpisodeId: string
  ): Promise<ChannelEpisode> {
    const groups = this.groupEpisodes(await this.videosService.findAll());
    const group = groups.get(channelId);

    if (!group) {
      throw new NotFoundException(`Channel "${channelId}" was not found.`);
    }

    const currentIndex = group.episodes.findIndex(
      (episode) => episode.id === afterEpisodeId
    );
    if (currentIndex < 0) {
      throw new NotFoundException(
        `Episode "${afterEpisodeId}" was not found in channel "${channelId}".`
      );
    }

    const nextIndex = (currentIndex + 1) % group.episodes.length;
    return {
      channelId: group.channel.id,
      channelName: group.channel.name,
      episode: group.episodes[nextIndex],
      startSeconds: 0
    };
  }

  private getCurrentProgram(
    channelId: string,
    channelName: string,
    episodes: (VideoFile & { durationSeconds: number })[],
    nowMs: number
  ): ChannelProgram {
    const cycleDuration = episodes.reduce(
      (total, episode) => total + episode.durationSeconds,
      0
    );

    if (cycleDuration <= 0) {
      throw new ServiceUnavailableException(
        `Channel "${channelName}" has no playable episodes.`
      );
    }

    const elapsedSeconds = (nowMs - this.cycleEpochMs) / 1000;
    let positionSeconds =
      ((elapsedSeconds % cycleDuration) + cycleDuration) % cycleDuration;
    let selectedEpisode = episodes[episodes.length - 1];

    for (const episode of episodes) {
      if (positionSeconds < episode.durationSeconds) {
        selectedEpisode = episode;
        break;
      }
      positionSeconds -= episode.durationSeconds;
    }

    const episodeStartMs = nowMs - positionSeconds * 1000;
    const episodeEndMs =
      nowMs + (selectedEpisode.durationSeconds - positionSeconds) * 1000;

    return {
      channelId,
      channelName,
      episode: selectedEpisode,
      startSeconds: positionSeconds,
      generatedAt: new Date(nowMs).toISOString(),
      programStartedAt: new Date(episodeStartMs).toISOString(),
      nextChangeAt: new Date(episodeEndMs).toISOString()
    };
  }

  private groupEpisodes(videos: VideoFile[]) {
    const groups = new Map<
      string,
      {
        channel: Omit<Channel, 'episodeCount' | 'nowPlaying'>;
        episodes: VideoFile[];
      }
    >();

    for (const video of videos) {
      const showName = video.path.split('/')[0] || 'Uncategorized';
      const id = this.toChannelId(showName);
      let group = groups.get(id);

      if (!group) {
        const newGroup = {
          channel: { id, name: showName },
          episodes: []
        };
        groups.set(id, newGroup);
        group = newGroup;
      }

      group.episodes.push(video);
    }

    for (const group of groups.values()) {
      group.episodes.sort((left, right) =>
        naturalOrder.compare(left.path, right.path)
      );
    }

    return groups;
  }

  private toChannelId(showName: string): string {
    const id = showName
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return id || 'uncategorized';
  }

  private async withDurations(
    videos: VideoFile[]
  ): Promise<(VideoFile & { durationSeconds: number })[]> {
    try {
      const results: (VideoFile & { durationSeconds: number })[] = new Array(
        videos.length
      );
      let nextIndex = 0;
      const readNextDuration = async () => {
        while (nextIndex < videos.length) {
          const index = nextIndex++;
          const video = videos[index];
          results[index] = {
            ...video,
            durationSeconds: await this.getDuration(video)
          };
        }
      };

      await Promise.all(
        Array.from(
          { length: Math.min(4, videos.length) },
          () => readNextDuration()
        )
      );
      return results;
    } catch {
      throw new ServiceUnavailableException(
        'Unable to read video durations. Install ffprobe on the API host or set FFPROBE_PATH.'
      );
    }
  }

  private getDuration(video: VideoFile): Promise<number> {
    const cached = this.durationCache.get(video.id);
    if (cached) {
      return cached;
    }

    const duration = this.readDuration(video.url).catch((error: unknown) => {
      this.durationCache.delete(video.id);
      throw error;
    });
    this.durationCache.set(video.id, duration);
    return duration;
  }

  private async readDuration(videoUrl: string): Promise<number> {
    const { stdout } = await execFileAsync(
      this.ffprobePath,
      [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        videoUrl
      ],
      { timeout: 30_000, maxBuffer: 1024 * 1024 }
    );
    const duration = Number(stdout.trim());

    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error(`Invalid video duration: ${videoUrl}`);
    }

    return duration;
  }
}
