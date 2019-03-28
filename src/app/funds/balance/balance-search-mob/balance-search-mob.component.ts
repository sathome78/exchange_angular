import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-balance-search-mob',
  templateUrl: './balance-search-mob.component.html',
  styleUrls: ['./balance-search-mob.component.scss']
})
export class BalanceSearchMobComponent implements OnInit, AfterViewInit {

  @Input() currencies: any[];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectedCurrency: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('input') input: ElementRef;
  @ViewChild('container') container: ElementRef;

  public scrollHeight: number = 0;
  public viewCurrencies = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.viewCurrencies = this.currencies;
  }

  ngAfterViewInit() {
    this.input.nativeElement.focus();
    setTimeout(() => {
      this.scrollHeight = this.container.nativeElement.offsetHeight - 143;
      this.cdr.detectChanges();
    }, 0);
  }

  selectCurrency(currency: string) {
    this.closeModal.emit(false);
    this.selectedCurrency.emit(currency);
  }

  onSearch(value) {
    this.viewCurrencies = this.currencies.filter(f => f.name.toLowerCase().includes(value.toLowerCase()));
  }

}
