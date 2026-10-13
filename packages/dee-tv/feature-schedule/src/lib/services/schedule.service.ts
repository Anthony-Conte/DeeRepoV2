import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Channel,
  ChannelProgram,
  NextChannelEpisode,
  Schedule
} from '../+state/schedule.models';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `http://${window.location.hostname}:3002/api`;

  getSchedule(): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.apiUrl}/videos`);
  }

  getChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/channels`);
  }

  getChannelNow(channelId: string): Observable<ChannelProgram> {
    return this.http.get<ChannelProgram>(
      `${this.apiUrl}/channels/${encodeURIComponent(channelId)}/now`
    );
  }

  getNextChannelEpisode(
    channelId: string,
    afterEpisodeId: string
  ): Observable<NextChannelEpisode> {
    return this.http.get<NextChannelEpisode>(
      `${this.apiUrl}/channels/${encodeURIComponent(channelId)}/next`,
      { params: { after: afterEpisodeId } }
    );
  }
}
