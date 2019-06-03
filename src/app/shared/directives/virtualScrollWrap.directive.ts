import {Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[appVSWraper]'
})
export class VirtualScrollWrapDirective {

  public wraper: HTMLElement;
  public rail: HTMLElement;
  public thumb: HTMLElement;
  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  createWraper() {
    this.wraper = this.renderer.createElement('div');
    this.renderer.addClass(this.wraper, 'scroll-wp');
    this.rail = this.renderer.createElement('div');
    this.renderer.addClass(this.rail, 'ex-rail');
    this.thumb = this.renderer.createElement('div');
    this.renderer.addClass(this.thumb, 'ex-thumb');
  }

}
