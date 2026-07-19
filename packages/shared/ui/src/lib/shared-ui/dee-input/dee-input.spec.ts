import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeeInput } from './dee-input';

describe('DeeInput', () => {
  let component: DeeInput;
  let fixture: ComponentFixture<DeeInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeeInput]
    }).compileComponents();

    fixture = TestBed.createComponent(DeeInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
