import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInsumosComponent } from './add-edit-insumos.component';

describe('AddEditInsumosComponent', () => {
  let component: AddEditInsumosComponent;
  let fixture: ComponentFixture<AddEditInsumosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditInsumosComponent]
    });
    fixture = TestBed.createComponent(AddEditInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
