import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarPilotoComponent } from './asignar-piloto.component';

describe('AsignarPilotoComponent', () => {
  let component: AsignarPilotoComponent;
  let fixture: ComponentFixture<AsignarPilotoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignarPilotoComponent]
    });
    fixture = TestBed.createComponent(AsignarPilotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
