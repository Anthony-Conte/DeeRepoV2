import {
  Injectable,
  ServiceUnavailableException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VideoFile } from './video.model';

@Injectable()
export class VideosService {
  private readonly videoBaseUrl: URL;
  private readonly videoExtensions = new Set([
    '.mp4',
    '.m4v',
    '.mkv',
    '.avi',
    '.mov',
    '.webm'
  ]);

  constructor(configService: ConfigService) {
    const configuredUrl =
      configService.get<string>('VIDEO_BASE_URL') ?? 'http://localhost:8000';
    this.videoBaseUrl = new URL(
      configuredUrl.endsWith('/') ? configuredUrl : `${configuredUrl}/`
    );
  }

  async findAll(): Promise<VideoFile[]> {
    try {
      const videos = await this.scanDirectory(
        this.videoBaseUrl,
        this.videoBaseUrl,
        new Set<string>()
      );

      return videos.sort((left, right) => left.path.localeCompare(right.path));
    } catch {
      throw new ServiceUnavailableException(
        `Could not read the video directory at ${this.videoBaseUrl.href}`
      );
    }
  }

  private async scanDirectory(
    directoryUrl: URL,
    rootUrl: URL,
    visitedDirectories: Set<string>
  ): Promise<VideoFile[]> {
    const directoryKey = directoryUrl.href;
    if (visitedDirectories.has(directoryKey)) {
      return [];
    }
    visitedDirectories.add(directoryKey);

    const response = await fetch(directoryUrl);
    if (!response.ok) {
      throw new Error(`Video server returned ${response.status}`);
    }

    const html = await response.text();
    const links = this.extractLinks(html)
      .map((href) => new URL(href, directoryUrl))
      .filter(
        (url) =>
          url.origin === rootUrl.origin &&
          url.pathname.startsWith(rootUrl.pathname)
      );

    const videos: VideoFile[] = [];
    const childDirectories: URL[] = [];

    for (const url of links) {
      url.search = '';
      url.hash = '';

      if (url.pathname.endsWith('/')) {
        childDirectories.push(url);
      } else if (this.isVideo(url.pathname)) {
        videos.push(this.toVideoFile(url, rootUrl));
      }
    }

    for (const childDirectory of childDirectories) {
      videos.push(
        ...(await this.scanDirectory(childDirectory, rootUrl, visitedDirectories))
      );
    }

    return videos;
  }

  private extractLinks(html: string): string[] {
    const links: string[] = [];
    const linkPattern = /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi;

    for (const match of html.matchAll(linkPattern)) {
      links.push(match[1]);
    }

    return links;
  }

  private isVideo(pathname: string): boolean {
    const extension = pathname.slice(pathname.lastIndexOf('.')).toLowerCase();
    return this.videoExtensions.has(extension);
  }

  private toVideoFile(url: URL, rootUrl: URL): VideoFile {
    const path = decodeURIComponent(url.pathname.slice(rootUrl.pathname.length));
    const pathSegments = path.split('/');
    const fileName = pathSegments[pathSegments.length - 1] ?? path;

    return {
      id: path,
      title: fileName.replace(/\.[^.]+$/, ''),
      path,
      url: url.href
    };
  }
}
