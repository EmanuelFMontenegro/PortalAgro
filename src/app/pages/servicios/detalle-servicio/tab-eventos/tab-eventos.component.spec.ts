import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabEventosComponent } from './tab-eventos.component';

describe('TabEventosComponent', () => {
  let component: TabEventosComponent;
  let fixture: ComponentFixture<TabEventosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabEventosComponent]
    });
    fixture = TestBed.createComponent(TabEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
