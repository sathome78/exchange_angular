import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';

@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss'],
  host: {
    '(document:click)': 'onClickOutsideInput($event)',
    '(document:keydown)': 'keyDown($event)',
    '(document:keydown.enter)': 'this.onSelectItem(this.filteredOptions[this.arrowKeyLocation])',
  },
})
export class DynamicInputComponent implements OnChanges {

  constructor(private _eref: ElementRef) { }

  @Input('options') public options: DIOptions[] = [];
  @Input('value') public value: string;
  // @Input('label') public label: string = '';
  @Input('icon') public icon: any = null;
  @Output('onSelect') public onSelect: EventEmitter<DIOptions> = new EventEmitter();
  @Output('onChange') public onChange: EventEmitter<string> = new EventEmitter();
  @ViewChild('input') inputElement: ElementRef;

  public filteredOptions: DIOptions[] = [];
  public showDropdown: boolean = false;
  public arrowKeyLocation = 0;

  keyDown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 38: // this is the ascii of arrow up
        if(this.showDropdown && this.arrowKeyLocation === 0) {
          this.arrowKeyLocation = this.filteredOptions.length - 1
          break;
        }
        if(!this.showDropdown) {
          break;
        }
        this.arrowKeyLocation--;
        break;
      case 40: // this is the ascii of arrow down
        if(!this.showDropdown && this.inputElement.nativeElement === document.activeElement) {
          this.arrowKeyLocation = 0;
          this.openDropdown();
          break;
        }
        if(this.showDropdown && this.arrowKeyLocation === (this.filteredOptions.length - 1)) {
          this.arrowKeyLocation = 0;
          break
        }
        this.arrowKeyLocation++;
        break;
    }
  }

  onClickOutsideInput(event: Event) {
    if (!this._eref.nativeElement.contains(event.target) ) {
      this.closeDropdown();
    }
  }

  ngOnChanges(changes) {
    if(changes.value) {
      if(changes.value.currentValue !== changes.value.previousValue) {
        this.arrowKeyLocation = 0;
        this.filterList(changes.value.currentValue);
      }
    }

  }

  onSelectItem(item: DIOptions): void {
    this.onChange.emit(item.text);
    this.onSelect.emit(item);
    this.closeDropdown();
  }

  filterList(val: string): void {
    if(!val || !this.options) {
      this.filteredOptions = [];
      return;
    }
    this.filteredOptions = this.options.filter((item) => item.text.toUpperCase().indexOf(val.toUpperCase()) >= 0);
    console.log(val, this.filteredOptions)
  }

  openDropdown(): void {
    this.showDropdown = true;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }
  onChangeFn(e) {
    this.onChange.emit(e.target.value);
    this.openDropdown();
  }

  preventEventInput(e) {
    if(e.which == 38 || e.which == 40){
      e.preventDefault();
    }
  }

}
