import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WidgetConfig } from 'src/app/models/widget.models';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent {
  @Input() config!: WidgetConfig;
  @Output() widgetClick = new EventEmitter<number>();

  onWidgetClick(): void {
    if (!this.config.isDisabled) {
      this.widgetClick.emit(this.config.widgetId);
    }

}
}
