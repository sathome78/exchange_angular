import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  breakpoint$: BehaviorSubject<string>;

  constructor(public breakpointObserver: BreakpointObserver) {
    // Breakpoints
    this.breakpointObserver
      .observe(['(min-width: 1200px)'])
      .subscribe((state: BreakpointState) => {
        const breakpoint = state.matches ? 'desktop' : 'mobile';

        if (!this.breakpoint$) {
          this.breakpoint$ = new BehaviorSubject<string>(breakpoint);
        } else {
          this.breakpoint$.next(breakpoint);
        }
      });
  }
}
