import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabInformesComponent } from './tab-informes.component';

describe('TabInformesComponent', () => {
  let component: TabInformesComponent;
  let fixture: ComponentFixture<TabInformesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabInformesComponent]
    });
    fixture = TestBed.createComponent(TabInformesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
