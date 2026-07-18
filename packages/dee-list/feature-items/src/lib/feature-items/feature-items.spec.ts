import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureItems } from './feature-items';

describe('FeatureItems', () => {
  let component: FeatureItems;
  let fixture: ComponentFixture<FeatureItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureItems],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
