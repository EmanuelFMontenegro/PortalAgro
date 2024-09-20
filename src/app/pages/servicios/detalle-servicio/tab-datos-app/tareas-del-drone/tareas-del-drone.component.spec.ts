import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasDelDroneComponent } from './tareas-del-drone.component';

describe('TareasDelDroneComponent', () => {
  let component: TareasDelDroneComponent;
  let fixture: ComponentFixture<TareasDelDroneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TareasDelDroneComponent]
    });
    fixture = TestBed.createComponent(TareasDelDroneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
