import { Directive, AfterViewInit, OnDestroy, Input } from '@angular/core';

@Directive({
  selector: '[appAddClass]',
})
export class AddClassDirective implements AfterViewInit, OnDestroy {
  @Input('appAddClass') className: string;
  @Input('to') selector: string;

  ngOnDestroy(): void {
    document.querySelector(this.selector).classList.remove(this.className);
  }

  ngAfterViewInit(): void {
    document.querySelector(this.selector).classList.add(this.className);
  }
}
