import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarEstadoComponent } from './cambiar-estado.component';

describe('CambiarEstadoComponent', () => {
  let component: CambiarEstadoComponent;
  let fixture: ComponentFixture<CambiarEstadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CambiarEstadoComponent]
    });
    fixture = TestBed.createComponent(CambiarEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
