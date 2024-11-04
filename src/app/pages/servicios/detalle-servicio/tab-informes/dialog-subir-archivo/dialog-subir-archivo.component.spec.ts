import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSubirArchivoComponent } from './dialog-subir-archivo.component';

describe('DialogSubirArchivoComponent', () => {
  let component: DialogSubirArchivoComponent;
  let fixture: ComponentFixture<DialogSubirArchivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSubirArchivoComponent]
    });
    fixture = TestBed.createComponent(DialogSubirArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
