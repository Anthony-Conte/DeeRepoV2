import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-dee-input',
  standalone: true,
  templateUrl: './dee-input.html',
  styleUrl: './dee-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeeInput),
      multi: true
    }
  ]
})
export class DeeInput implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';

  value = '';
  disabled = false;

  private onChange = (value: string) => {
    /* empty */
  };
  private onTouched = () => {
    /* empty */
  };

  writeValue(value: string): void {
    this.value = value ?? '';
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
  }

  onBlur(): void {
    this.onTouched();
  }
}
