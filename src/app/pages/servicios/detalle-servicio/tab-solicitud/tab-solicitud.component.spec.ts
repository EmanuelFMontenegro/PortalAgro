import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSolicitudComponent } from './tab-solicitud.component';

describe('TabSolicitudComponent', () => {
  let component: TabSolicitudComponent;
  let fixture: ComponentFixture<TabSolicitudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabSolicitudComponent]
    });
    fixture = TestBed.createComponent(TabSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
