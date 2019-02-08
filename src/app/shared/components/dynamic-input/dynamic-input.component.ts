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
  @Input('setNullValue') public setNullValue: boolean = false;
  @Output('onSelect') public onSelect: EventEmitter<DIOptions> = new EventEmitter();
  @Output('onChange') public onChange: EventEmitter<string> = new EventEmitter();
  @ViewChild('input') inputElement: ElementRef;
  @ViewChild('list') listElement: ElementRef;

  public filteredOptions: DIOptions[] = [];
  public showDropdown: boolean = false;
  public arrowKeyLocation = 0;

  keyDown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 38: // this is the ascii of arrow up
        event.stopPropagation();
        if(this.showDropdown && this.arrowKeyLocation === 0) {
          break;
        }
        if(!this.showDropdown) {
          break;
        }
        this.arrowKeyLocation--;
        const el = this.listElement.nativeElement.querySelector(`li[data-key="${this.arrowKeyLocation}"]`);
        if(el) {
          el.scrollIntoView(false)
        }
        break;
      case 40: // this is the ascii of arrow down
        event.stopPropagation();
        if(!this.showDropdown && this.inputElement.nativeElement === document.activeElement) {
          this.arrowKeyLocation = 0;
          this.openDropdown();
          break;
        }
        if(this.showDropdown && this.arrowKeyLocation === (this.filteredOptions.length - 1)) {
          break
        }
        this.arrowKeyLocation++;
        const el2 = this.listElement.nativeElement.querySelector(`li[data-key="${this.arrowKeyLocation}"]`);
        if(el2) {
          el2.scrollIntoView(false)
        }
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
      if(changes.value.currentValue === '' && !changes.value.firstChange) {
        this.onSelect.emit({id: null, text: null});
      }
    }

  }

  onClearInput(): void {
    this.onChange.emit('');
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

  onHover(e) {
    this.arrowKeyLocation = +e.target.dataset['key']
  }

  trackByFn(index, item) {
    return item.text; // or item.id
  }

}
