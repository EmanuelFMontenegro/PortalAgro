import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerLotesComponent } from './ver-lotes.component';

describe('VerLotesComponent', () => {
  let component: VerLotesComponent;
  let fixture: ComponentFixture<VerLotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerLotesComponent]
    });
    fixture = TestBed.createComponent(VerLotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
