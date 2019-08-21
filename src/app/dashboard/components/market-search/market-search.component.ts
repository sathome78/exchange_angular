import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CurrencyPair } from '../../../model/currency-pair.model';
@Component({
  selector: 'app-market-search',
  templateUrl: 'market-search.component.html',
  styleUrls: ['market-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketSearchComponent implements OnInit, AfterViewInit {
  @Input() pairs: CurrencyPair[];
  @Input() currency: string;
  @Input() userFavorites: number[] = [];
  @Input() public isAuthenticated = false;
  public showPairs: CurrencyPair[];
  public scrollHeight = 0;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickItem: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('input') input: ElementRef;
  @ViewChild('container') container: ElementRef;

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.showPairs = [...(this.pairs || [])];
  }
  ngAfterViewInit() {
    this.input.nativeElement.focus();
    setTimeout(() => {
      this.scrollHeight = this.container.nativeElement.offsetHeight - 109;
      this.cdr.detectChanges();
    }, 0);
  }

  splitPairName(name: string): string[] {
    return name.split('/');
  }

  onSearch(event) {
    this.showPairs = this.pairs.filter(f => f.currencyPairName.toUpperCase().match(event.toUpperCase()));
  }

  onCloseModal() {
    this.closeModal.emit(true);
  }

  isFavorite(pair: CurrencyPair): boolean {
    return this.userFavorites.indexOf(pair.currencyPairId) >= 0;
  }

}
