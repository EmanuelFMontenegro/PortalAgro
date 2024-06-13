import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendariosComponent } from './calendarios.component';

describe('CalendariosComponent', () => {
  let component: CalendariosComponent;
  let fixture: ComponentFixture<CalendariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendariosComponent]
    });
    fixture = TestBed.createComponent(CalendariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
