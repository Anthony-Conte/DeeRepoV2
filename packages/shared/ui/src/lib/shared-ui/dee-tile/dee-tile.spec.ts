import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeeTile } from './dee-tile';

describe('DeeTile', () => {
  let component: DeeTile;
  let fixture: ComponentFixture<DeeTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeeTile]
    }).compileComponents();

    fixture = TestBed.createComponent(DeeTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
