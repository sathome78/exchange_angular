import {Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {Router, NavigationEnd} from '@angular/router';

@Injectable()
export class SEOService {
  constructor(
    private meta: Meta,
    private router: Router,
    private titleService: Title
  ) {
    router.events.subscribe((e) => {
      if(e instanceof NavigationEnd){
        console.log(e);
        const tag = this.getTags(e.urlAfterRedirects);
        titleService.setTitle(tag.name);
        meta.updateTag({name: 'description', content: tag.content});
      }
    });
  }

  getTags(url) {
    switch(url) {
      case '/':
        return {
          name: 'Exrates',
          content: 'Exartes Cryptocurrency Exchange - more than 500 trading pairs, minimum commissions and maximum security'
        };
      case '/dashboard':
        return {
          name: 'Exrates | Dashboard',
          content: 'The easiest way to buy BTC, ETH, LTC and more than 200 altcoins. Start trading now with Exartes Cryptocurrency Exchange!'
        };
      case '/static/terms-and-conditions':
        return {
          name: 'Terms & Conditions',
          content: 'Read the Terms of use of Exrates cryptocurrency exchange.'
        };
      case '/static/privacy-policy':
        return {
          name: 'Privacy Policy',
          content: 'Thinking of using the Exrates Cryptocurrency Exchange? Just check the privacy policy and register on Exrates in one click!'
        };
      case '/static/contacts':
        return {
          name: 'Contact Us',
          content: 'Our support team is online 24/7 to help you to solve any issues. Visit our representative offices all aroud the world.'
        };
      case '/static/about-us':
        return {
          name: 'About Us',
          content: 'High functionality of the website and a usable price chart – this is what one needs for convenient trading.  Welcome to Exrates! '
        };
      case '/funds/balances':
        return {
          name: 'Balances',
          content: 'Check the current balance for all currencies you own, including your total amount and your current value in FIAT and BTC.'
        };
      case '/funds/transaction-history':
        return {
          name: 'Transaction History',
          content: 'Check your transaction history on Exrates.  All your deposit, withdrawal, and transfer records in one place.'
        };
      case '/orders/open':
        return {
          name: 'Open Orders',
          content: 'See and manage your open orders here. Our aim is to make trading accessible for everyone and provide all the tools needed. '
        };
      case '/orders/closed':
        return {
          name: 'Closed Orders',
          content: 'View all of your  closed orders in the Order History. '
        };
      case '/settings/two-factor-auth':
        return {
          name: '2FA Settings',
          content: 'Setup Google Authenticator on Exartes Cryptocurrency Exchange in one click'
        };
      case '/settings/password':
        return {
          name: 'Password Settings',
          content: 'Your data security is above all. Click here for setting up security on Exrates exchange.'
        };
      case '/settings/session':
        return {
          name: 'Security Settings',
          content: 'Check all your active sessions in your account\'s security settings. Exrates saves login data and analyzes it for any unusual activity'
        };
      default:
        return {
          name: '',
          content: ''
        };

    }
  }
}
