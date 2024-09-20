import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditarInsumoComponent } from './dialog-editar-insumo.component';

describe('DialogEditarInsumoComponent', () => {
  let component: DialogEditarInsumoComponent;
  let fixture: ComponentFixture<DialogEditarInsumoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogEditarInsumoComponent]
    });
    fixture = TestBed.createComponent(DialogEditarInsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
