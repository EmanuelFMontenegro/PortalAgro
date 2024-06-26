import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDronesComponent } from './add-edit-drones.component';

describe('AddEditDronesComponent', () => {
  let component: AddEditDronesComponent;
  let fixture: ComponentFixture<AddEditDronesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditDronesComponent]
    });
    fixture = TestBed.createComponent(AddEditDronesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
