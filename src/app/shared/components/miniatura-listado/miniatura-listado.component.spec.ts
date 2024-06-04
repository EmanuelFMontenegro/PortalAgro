import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniaturaListadoComponent } from './miniatura-listado.component';

describe('CalendarioComponent', () => {
  let component: MiniaturaListadoComponent;
  let fixture: ComponentFixture<MiniaturaListadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiniaturaListadoComponent]
    });
    fixture = TestBed.createComponent(MiniaturaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
