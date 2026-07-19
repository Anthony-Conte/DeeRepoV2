import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeeButton } from './dee-button';
describe('DeeButton', () => {
  let component: DeeButton;
  let fixture: ComponentFixture<DeeButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeeButton]
    }).compileComponents();

    fixture = TestBed.createComponent(DeeButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
