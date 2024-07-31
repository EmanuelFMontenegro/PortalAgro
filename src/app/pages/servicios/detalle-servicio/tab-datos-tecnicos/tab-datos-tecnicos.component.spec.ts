import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDatosTecnicosComponent } from './tab-datos-tecnicos.component';

describe('TabDatosTecnicosComponent', () => {
  let component: TabDatosTecnicosComponent;
  let fixture: ComponentFixture<TabDatosTecnicosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabDatosTecnicosComponent]
    });
    fixture = TestBed.createComponent(TabDatosTecnicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
