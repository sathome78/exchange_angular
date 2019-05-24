import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appExcludeInputSpaces]',
})
export class ExcludeSpacesDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('input', ['$event']) onInput(event) {
    if (event.data === ' ' || event.inputType === 'insertFromPaste') {
      this.el.nativeElement.value = this.deleteSpace(event.target.value);
    }
  }

  private deleteSpace(value): string {
    if (value) {
      const replaceMask = '';
      const searchMask = ' ';
      const regex = new RegExp(searchMask, 'ig');
      return value.toString().replace(regex, replaceMask);
    }
    return '';
  }
}
