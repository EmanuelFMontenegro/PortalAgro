import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditServicioComponent } from './add-edit-servicio.component';

describe('AddEditServicioComponent', () => {
  let component: AddEditServicioComponent;
  let fixture: ComponentFixture<AddEditServicioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditServicioComponent]
    });
    fixture = TestBed.createComponent(AddEditServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
