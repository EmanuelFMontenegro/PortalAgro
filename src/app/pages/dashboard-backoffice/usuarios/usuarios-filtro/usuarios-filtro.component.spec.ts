import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosFiltroComponent } from './usuarios-filtro.component';

describe('UsuariosFiltroComponent', () => {
  let component: UsuariosFiltroComponent;
  let fixture: ComponentFixture<UsuariosFiltroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuariosFiltroComponent]
    });
    fixture = TestBed.createComponent(UsuariosFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
