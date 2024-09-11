import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarTecnicoComponent } from './asignar-tecnico.component';

describe('AsignarTecnicoComponent', () => {
  let component: AsignarTecnicoComponent;
  let fixture: ComponentFixture<AsignarTecnicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignarTecnicoComponent]
    });
    fixture = TestBed.createComponent(AsignarTecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
