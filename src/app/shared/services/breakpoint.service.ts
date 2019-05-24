import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  breakpoint$: BehaviorSubject<string>;

  constructor(public breakpointObserver: BreakpointObserver) {
    // Breakpoints
    this.breakpointObserver
      .observe(['(min-width: 1200px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          if (!this.breakpoint$) {
            this.breakpoint$ = new BehaviorSubject<string>('desktop');
          } else {
            this.breakpoint$.next('desktop');
          }
        } else {
          if (!this.breakpoint$) {
            this.breakpoint$ = new BehaviorSubject<string>('mobile');
          } else {
            this.breakpoint$.next('mobile');
          }
        }
      });
  }
}
