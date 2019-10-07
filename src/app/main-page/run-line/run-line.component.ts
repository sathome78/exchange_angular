import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State, getMarketCurrencyPairsMap } from 'app/core/reducers/index';
import { takeUntil } from 'rxjs/operators';
import { CurrencyPair } from 'app/model';
import { Subject } from 'rxjs';

// function runInit() {
//   const runItemArray = document.querySelectorAll('.run-line-inner');
//   const lineLength = runItemArray.length * document.querySelector('.run-line-inner').clientWidth;
//   runItemArray.forEach(item => {

//     const changePosition = parseFloat(item.getAttribute('data-position')) - 0.7;
//     item.setAttribute('data-position', `${changePosition}`);
//     item.setAttribute('style', `transform:translateX(${changePosition}px)`);
//     if (item.getBoundingClientRect().left + item.clientWidth < 0) {
//       item.setAttribute('data-position', `${changePosition + lineLength}`);
//       item.setAttribute('style', `transform:translateX(${changePosition + lineLength}px)`);
//     }
//   });
//   window.requestAnimationFrame(runInit);
// }

@Component({
  selector: 'app-run-line',
  templateUrl: './run-line.component.html',
  styleUrls: ['./run-line.component.scss'],
})
export class RunLineComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public currencyPairsCache: CurrencyPair[] = [];
  public currencyPairs: CurrencyPair[] = [];

  public slideConfig = {
    autoplay: true,
    slidesToShow: 8,
    autoplaySpeed: 1,
    cssEase: 'linear',
    pauseOnFocus: false,
    speed: 10000,
    arrows: false,
    dots: false,
    infinite: true,
    responsive: [
      {
        breakpoint: 1680,
        settings: {
          slidesToShow: 7,
        }
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 6,
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
        }
      },
      {
        breakpoint: 880,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 670,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 2,
        }
      },
      // {
      //   breakpoint: 361,
      //   settings: {
      //     slidesToShow: 1,
      //   }
      // }
    ]

  };

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.store
      .pipe(select(getMarketCurrencyPairsMap))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (currencyPairs: MapModel<CurrencyPair>) => {
          this.currencyPairsCache = Object.values(currencyPairs);
          this.filterTopMarket();
          if (this.currencyPairs.length) {
            // window.requestAnimationFrame(runInit);
          }
        },
        err => {
          console.error(err);
        }
      );
  }

  filterTopMarket() {
    this.currencyPairs = this.currencyPairsCache
      .filter(pair => !!pair.topMarket)
      .sort((a, b) => +b.currencyVolume - +a.currencyVolume);
    if (this.currencyPairs.length < 20) {
      const bestFromJunior = this.currencyPairsCache
        .filter(pair => !pair.topMarket)
        .sort((a, b) => +b.currencyVolume - +a.currencyVolume);
      this.currencyPairs = [...this.currencyPairs, ...bestFromJunior.slice(0, 20 - this.currencyPairs.length)];
    }
  }

  trackByPairs(index, item) {
    return item.currencyPairId;
  }

  isChangePositive(pair: CurrencyPair): boolean {
    return +pair.lastOrderRate >= +pair.lastOrderRate24hr;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
