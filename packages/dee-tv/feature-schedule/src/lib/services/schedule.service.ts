import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Schedule } from '../+state/schedule.models';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `http://${window.location.hostname}:3002/api/videos`;

  getSchedule(): Observable<Schedule> {
    return this.http.get<Schedule>(this.apiUrl);
  }
}
