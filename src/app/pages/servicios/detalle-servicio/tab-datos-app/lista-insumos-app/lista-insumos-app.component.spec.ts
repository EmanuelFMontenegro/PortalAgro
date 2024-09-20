import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInsumosAppComponent } from './lista-insumos-app.component';

describe('ListaInsumosAppComponent', () => {
  let component: ListaInsumosAppComponent;
  let fixture: ComponentFixture<ListaInsumosAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaInsumosAppComponent]
    });
    fixture = TestBed.createComponent(ListaInsumosAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
