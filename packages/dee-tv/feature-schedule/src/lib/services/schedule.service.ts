import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Schedule } from '../+state/schedule.models';

const MOCK_SCHEDULE: Schedule = [
  { id: 'morning-news', title: 'Morning News' },
  { id: 'wildlife-today', title: 'Wildlife Today' },
  { id: 'classic-cinema', title: 'Classic Cinema' }
];

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  getSchedule(): Observable<Schedule> {
    return of(MOCK_SCHEDULE);
  }
}
