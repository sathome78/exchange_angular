import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State, getDetailedCurrencyPairsSelector } from 'app/core/reducers';
import { take } from 'rxjs/operators';
import { DetailedCurrencyPair } from 'app/model/detailed-currency-pair';

@Injectable()
export class SEOService {
  public currencyPairs = [];
  public currentUrl = null;
  constructor(private meta: Meta, private router: Router, private store: Store<State>, private titleService: Title) {
    this.store
      .pipe(select(getDetailedCurrencyPairsSelector))
      .pipe(take(2))
      .subscribe((currencies: DetailedCurrencyPair[]) => {
        this.currencyPairs = currencies;
        if (this.currencyPairs.length && this.currentUrl && this.currentUrl.startsWith('/markets/')) {
          const param = this.getMarketsParam(this.currentUrl);
          this.titleService.setTitle(param.title);
          this.meta.updateTag({
            name: 'description',
            content: param.description,
          });
        }
      });
  }

  subscribeToRouter() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.currentUrl = e.urlAfterRedirects;
        let param;
        if (this.currentUrl.startsWith('/markets/')) {
          param = this.getMarketsParam(this.currentUrl);
        } else {
          param = this.getParams(this.currentUrl);
        }
        this.titleService.setTitle(param.title);
        this.meta.updateTag({
          name: 'description',
          content: param.description,
        });
      }
    });
  }

  getMarketsParam(url) {
    const urlCurrPair = url.split('/')[2];
    const currs = urlCurrPair.split('-');

    const pair = currs[0].toUpperCase() + '/' + currs[1].toUpperCase();
    const detailedPair = this.currencyPairs.filter(item => item.name === pair)[0];
    if (!detailedPair) {
      return {
        title: 'Exrates',
        description: '',
      };
    }

    const title = `${pair}| ${detailedPair.currency1.description} to ${
      detailedPair.currency2.description
    } | Crypto trading at Exrates`;
    const description =
      `${pair} - buy ${detailedPair.currency1.description} for ${
        detailedPair.currency2.description
      } at Exrates cryptocurrency exchange.` +
      `${detailedPair.currency1.description} to ${
        detailedPair.currency2.description
      } market at Exrates - ${currs[0].toUpperCase()} price, ` +
      `${currs[0].toUpperCase()} price charts, ${currs[0].toUpperCase()} market cap. The lowest transaction fees.`;

    return {
      title,
      description,
    };
  }

  getParams(url) {
    switch (true) {
      case url.startsWith('/dashboard'):
        return {
          title: 'Exrates | Dashboard',
          description:
            'The easiest way to buy BTC, ETH, LTC and more than 200 altcoins. Start trading now with Exartes Cryptocurrency Exchange!',
        };
      case url.startsWith('/static/terms-and-conditions'):
        return {
          title: 'Terms & Conditions',
          description: 'Read the Terms of use of Exrates cryptocurrency exchange.',
        };
      case url.startsWith('/static/privacy-policy'):
        return {
          title: 'Privacy Policy',
          description:
            'Thinking of using the Exrates Cryptocurrency Exchange? Just check the privacy policy and register on Exrates in one click!',
        };
      case url.startsWith('/static/about-us'):
        return {
          title: 'About Us',
          description:
            'High functionality of the website and a usable price chart – this is what one needs for convenient trading.  Welcome to Exrates! ',
        };
      case url.startsWith('/funds/balances'):
        return {
          title: 'Balances',
          description:
            'Check the current balance for all currencies you own, including your total amount and your current value in FIAT and BTC.',
        };
      case url.startsWith('/funds/transaction-history'):
        return {
          title: 'Transaction History',
          description:
            'Check your transaction history on Exrates.  All your deposit, withdrawal, and transfer records in one place.',
        };
      case url.startsWith('/orders/open'):
        return {
          title: 'Open Orders',
          description:
            'See and manage your open orders here. Our aim is to make trading accessible for everyone and provide all the tools needed. ',
        };
      case url.startsWith('/orders/closed'):
        return {
          title: 'Orders History',
          description: 'View all of your  closed orders in the Order History. ',
        };
      case url.startsWith('/settings/two-factor-auth'):
        return {
          title: '2FA Settings',
          description: 'Setup Google Authenticator on Exartes Cryptocurrency Exchange in one click',
        };
      case url.startsWith('/settings/password'):
        return {
          title: 'Password Settings',
          description: 'Your data security is above all. Click here for setting up security on Exrates exchange.',
        };
      case url.startsWith('/settings/session'):
        return {
          title: 'Security Settings',
          description:
            'Check all your active sessions in your account\'s security settings. Exrates saves login data and analyzes it for any unusual activity',
        };
      case url.startsWith('/news'):
        return {
          title: 'News',
          description: '',
        };
      case url.startsWith('/ieo'):
        return {
          title: 'IEO',
          description: '',
        };
      case url.startsWith('/fiat'):
        return {
          title: 'FIAT',
          description: '',
        };
      case url.startsWith('/'):
        return {
          title: 'Exrates',
          description:
            'Exartes Cryptocurrency Exchange - more than 500 trading pairs, minimum commissions and maximum security',
        };
      default:
        return {
          title: 'Exrates',
          description: '',
        };
    }
  }
}
