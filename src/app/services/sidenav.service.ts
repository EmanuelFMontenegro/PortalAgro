import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  public sidenavOpen = new BehaviorSubject<boolean>(false);
  public sidenavOpen$ = this.sidenavOpen.asObservable();

  constructor() { }

  public toggle(): void {
    console.log(!this.sidenavOpen.value)
    this.sidenavOpen.next(!this.sidenavOpen.value);
  }

  public changeState(state: boolean): void {
    this.sidenavOpen.next(state);
  }
}