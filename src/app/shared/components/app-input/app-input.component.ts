import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [IonInput, ReactiveFormsModule],
  templateUrl: './app-input.component.html',
  styleUrls: ['./app-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInputComponent),
      multi: true,
    },
  ],
})
export class AppInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'tel' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() errorMessage = '';
  @Input() readonly = false;

  value = '';
  isDisabled = false;

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const val = (event as CustomEvent).detail.value ?? '';
    this.value = val;
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(val: string): void {
    this.value = val ?? '';
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
