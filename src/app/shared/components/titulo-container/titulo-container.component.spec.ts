import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TituloContainerComponent } from './titulo-container.component';

describe('TituloContainerComponent', () => {
  let component: TituloContainerComponent;
  let fixture: ComponentFixture<TituloContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TituloContainerComponent]
    });
    fixture = TestBed.createComponent(TituloContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
