import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbarProdComponent } from './searchbar-prod.component';

describe('SearchbarProdComponent', () => {
  let component: SearchbarProdComponent;
  let fixture: ComponentFixture<SearchbarProdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchbarProdComponent]
    });
    fixture = TestBed.createComponent(SearchbarProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
