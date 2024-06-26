import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosContainerComponent } from './filtros-container.component';

describe('FiltrosContainerComponent', () => {
  let component: FiltrosContainerComponent;
  let fixture: ComponentFixture<FiltrosContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltrosContainerComponent]
    });
    fixture = TestBed.createComponent(FiltrosContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
