import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaImagenesAppComponent } from './lista-imagenes-app.component';

describe('ListaImagenesAppComponent', () => {
  let component: ListaImagenesAppComponent;
  let fixture: ComponentFixture<ListaImagenesAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaImagenesAppComponent]
    });
    fixture = TestBed.createComponent(ListaImagenesAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
