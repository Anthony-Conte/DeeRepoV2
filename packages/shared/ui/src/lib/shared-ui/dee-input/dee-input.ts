import { AfterViewInit, Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'lib-dee-input',
  templateUrl: './dee-input.html',
  styleUrl: './dee-input.css'
})
export class DeeInput implements ControlValueAccessor, AfterViewInit {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() maxlength?: number;
  @Input() errorMap: Record<string, string> = {};
  @Input() showErrors = false;

  value = '';
  disabled = false;
  protected errorMessage = '';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get invalid(): boolean {
    const control = this.ngControl?.control;

    return !!control && control.invalid && (control.touched || control.dirty);
  }

  public ngAfterViewInit(): void {
    this.udpateError();
  }

  private onChange = (value: string) => {
    /* empty */
  };
  private onTouched = () => {
    /* empty */
  };

  writeValue(value: string): void {
    this.value = value ?? '';
    setTimeout(() => {
      this.udpateError();
    });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.value = value;
    this.onChange(value);
    this.udpateError();
  }

  onBlur(): void {
    this.onTouched();
    this.udpateError();
  }

  private udpateError(): void {
    const control = this.ngControl?.control;

    if (control) {
      const errors = control.errors;
      if (errors) {
        const firstErrorKey = Object.keys(errors)[0];
        this.errorMessage = this.errorMap[firstErrorKey] || 'Invalid input';
      } else {
        this.errorMessage = '';
      }
    }
  }
}
