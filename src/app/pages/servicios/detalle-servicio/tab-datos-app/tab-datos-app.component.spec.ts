import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDatosAppComponent } from './tab-datos-app.component';

describe('TabDatosAppComponent', () => {
  let component: TabDatosAppComponent;
  let fixture: ComponentFixture<TabDatosAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabDatosAppComponent]
    });
    fixture = TestBed.createComponent(TabDatosAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
