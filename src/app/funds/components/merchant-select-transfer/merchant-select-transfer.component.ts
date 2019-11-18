import { Component, OnInit, Input, Output, HostListener, ElementRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-merchant-select-transfer',
  templateUrl: './merchant-select-transfer.component.html',
  styleUrls: ['./merchant-select-transfer.component.scss'],
})
export class MerchantSelectTransferComponent implements OnInit {

  @Input() public activeMerchant = null;
  @Input() public merchants: any[] = [];
  @Input() public disabled: boolean;
  @Output() public selectMerchant: EventEmitter<any> = new EventEmitter();
  @Output() public toggleDropdown: EventEmitter<boolean> = new EventEmitter();
  public openDropdown = false;

  @HostListener('document:click', ['$event.target']) clickout(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.openDropdown = false;
    }
  }

  constructor(private _elementRef: ElementRef) { }

  ngOnInit() { }

  onToggleDropdown() {
    if (!this.disabled) {
      this.openDropdown = !this.openDropdown;
      this.toggleDropdown.emit(this.openDropdown);
    }
  }

  closeDropdown() {
    this.openDropdown = false;
    this.toggleDropdown.emit(this.openDropdown);
  }

  onSelect(merchant) {
    this.selectMerchant.emit(merchant);
    this.onToggleDropdown();
  }

}
