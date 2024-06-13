import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionAddEditComponent } from './configuracion-add-edit.component';

describe('ConfiguracionAddEditComponent', () => {
  let component: ConfiguracionAddEditComponent;
  let fixture: ComponentFixture<ConfiguracionAddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfiguracionAddEditComponent]
    });
    fixture = TestBed.createComponent(ConfiguracionAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
