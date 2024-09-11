import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInsumosComponent } from './lista-insumos.component';

describe('ListaInsumosComponent', () => {
  let component: ListaInsumosComponent;
  let fixture: ComponentFixture<ListaInsumosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaInsumosComponent]
    });
    fixture = TestBed.createComponent(ListaInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
