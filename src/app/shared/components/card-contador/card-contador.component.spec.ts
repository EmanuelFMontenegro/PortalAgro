import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardContadorComponent } from './card-contador.component';

describe('CardContadorComponent', () => {
  let component: CardContadorComponent;
  let fixture: ComponentFixture<CardContadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardContadorComponent]
    });
    fixture = TestBed.createComponent(CardContadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
