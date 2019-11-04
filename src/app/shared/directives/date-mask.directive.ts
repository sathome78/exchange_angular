import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDateMask]',
})
export class DateMaskDirective {
  constructor(private el: ElementRef) {}

  @Input() appDateMask: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(e) {
    if (this.appDateMask) {
      if (e.target.value[e.target.value.length - 1] === '.') {
        this.el.nativeElement.value = e.target.value.slice(0, e.target.value.length - 1);
      }
      if (
        [46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
        // Allow: .
        (e.keyCode === 190 && e.key === '.') ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    }
  }

  @HostListener('input', ['$event']) onInput(event) {
    const value = event.target.value;
    let changeValue = value;
    switch (value.length) {
      case 1:
        changeValue = +value > 3 ? '' : value;
        break;
      case 2:
        changeValue = +value[0] === 3 && +value[1] > 1 ? value[0] : value;
        break;
      case 3:
        changeValue =
          +value[2] > 1
            ? value.slice(0, value.length - 1)
            : value[2] === '.'
            ? `${value.slice(0, 2)}.`
            : `${value.slice(0, 2)}.${value[2]}`;
        break;
      case 5:
        changeValue = +value[3] === 1 && +value[4] > 2 ? value.slice(0, value.length - 1) : value;
        break;
      case 6:
        changeValue =
          +value[5] < 1 || +value[5] > 2
            ? value.slice(0, value.length - 1)
            : value[5] === '.'
            ? `${value.slice(0, 5)}.`
            : `${value.slice(0, 5)}.${value[5]}`;
        break;
    }
    this.el.nativeElement.value = changeValue;
  }
}
