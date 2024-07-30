import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html',
  styleUrls: ['./paginador.component.sass'],
})
export class PaginadorComponent {
  @Input() length: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Output() page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  itemsPerPageLabel = 'Artículos por página:';
  nextPageLabel = 'Siguiente página';
  previousPageLabel = 'Página anterior';

  handlePageEvent(event: PageEvent) {
    this.page.emit(event);
  }
}
