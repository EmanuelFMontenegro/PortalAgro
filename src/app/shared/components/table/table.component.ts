import { Component, ContentChild, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html', 
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() subtitle?: string;
  @ContentChild('headers') headers: TemplateRef<any> | undefined;
  @ContentChild('rows') rows: TemplateRef<any> | undefined;
  
}
