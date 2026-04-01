import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppButtonComponent } from '../../../../shared/components/app-button/app-button.component';

@Component({
  selector: 'app-business-empty-state',
  standalone: true,
  imports: [AppButtonComponent],
  templateUrl: './business-empty-state.component.html',
  styleUrls: ['./business-empty-state.component.scss'],
})
export class BusinessEmptyStateComponent {
  @Input() message = 'No businesses found.';
  @Input() showClear = false;
  @Output() clear = new EventEmitter<void>();
}
