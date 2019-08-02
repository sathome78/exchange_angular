import { Injectable } from '@angular/core';

@Injectable()
export class GtagService {
  public isSetUserId = false;

  constructor() {}

  sendRegistrationGtag() {
    this.gtag('event', 'sent-form', {
      event_category: 'registration-form',
      event_label: 'successe-form-sent',
    });
    console.log('Successfully send registration gtag');
  }

  sendConfirmationPasswordGtag() {
    this.gtag('event', 'password-correct', {
      event_category: 'password-confirm',
      event_label: 'finish-registration',
    });
    console.log('Successfully send confirmation password gtag');
  }

  sendLoginSuccessGtag() {
    this.gtag('event', 'login-success', {
      event_category: 'login-form',
      event_label: 'login-success',
    });
    console.log('successfully send login gtag');
  }

  sendTransactionSuccessGtag() {
    this.gtag({ event: 'transaction' });
    console.log('successfully send transactions gtag');
  }

  sendRecoveryPasswordGtag() {
    this.gtag('event', 'pass-recovered', {
      event_category: 'recovered-pass',
      event_label: 'recovered-success',
    });
    console.log('Successfully send password recovery gtag');
  }

  sendGenerateWalletGtag(id) {
    this.gtag('event', 'recharge-ballance', {
      event_category: 'recharge-ballance',
      event_label: id,
    });
    console.log('Successfully send generate wallet send');
  }

  setUserId(id: string) {
    if (!this.isSetUserId) {
      this.isSetUserId = true;
      this.gtag('set', { user_id: id });
      this.gtag('config', 'GTM-TPR6SBC');
      console.log('Set user id gtag');
    }
  }

  removeUserId() {
    if (this.isSetUserId) {
      this.isSetUserId = false;
      this.gtag('set', { user_id: '' });
      this.gtag('config', 'GTM-TPR6SBC');
      console.log('Remove user id gtag');
    }
  }

  initGtag() {
    this.gtag('js', new Date());
    this.gtag('config', 'GTM-TPR6SBC');
    console.log('Init gtag');
  }

  private gtag(...argument) {
    (window as any).dataLayer.push(arguments);
  }
}

// new id => GTM-TPR6SBC
// old id => GTM-TZTXSSP
