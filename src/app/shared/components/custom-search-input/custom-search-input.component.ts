import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-custom-search-input',
  templateUrl: './custom-search-input.component.html',
  styleUrls: ['./custom-search-input.component.scss']
})
export class CustomSearchInputComponent implements OnInit {

  @Input() coins ;
  @Output() selectedCoin: EventEmitter<any> = new EventEmitter();
  @ViewChild('searchInput') searchInput: ElementRef;
  public showCoins = [];

  constructor() { }

  ngOnInit() {
  }

  searchCoin(e) {
    this.showCoins = e.target.value ? this.coins.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase())) : [];
  }

  selectCoin(coin) {
    this.selectedCoin.emit(coin);
    this.searchInput.nativeElement.value = '';
    this.showCoins = [];
  }

  trackByCoin(index, item) {
    return item.name;
  }

}
