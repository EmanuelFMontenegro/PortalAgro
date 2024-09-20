import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDatosAppComponent } from './editar-datos-app.component';

describe('EditarDatosAppComponent', () => {
  let component: EditarDatosAppComponent;
  let fixture: ComponentFixture<EditarDatosAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarDatosAppComponent]
    });
    fixture = TestBed.createComponent(EditarDatosAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
