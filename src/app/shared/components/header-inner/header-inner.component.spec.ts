import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInnerComponent } from './header-inner.component';

describe('HeaderInnerComponent', () => {
  let component: HeaderInnerComponent;
  let fixture: ComponentFixture<HeaderInnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderInnerComponent]
    });
    fixture = TestBed.createComponent(HeaderInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
