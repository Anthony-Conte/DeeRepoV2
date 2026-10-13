import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureSchedule } from './feature-schedule';

describe('FeatureSchedule', () => {
  let component: FeatureSchedule;
  let fixture: ComponentFixture<FeatureSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureSchedule]
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
