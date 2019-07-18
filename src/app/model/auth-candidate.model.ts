import {environment} from '../../environments/environment';
import {UtilsService} from '../shared/services/utils.service';
import {Store} from '@ngrx/store';

export class AuthCandidate {

  public email;
  public password;
  public appKey = 'f966d047-75fb-4458-b9c3-3bd444e452b8';
  public pin;
  public isPinRequired;
  public clientIp;
  public tries;

  constructor() {
  }

  public static builder(): AuthCandidate {
    return new AuthCandidate();
  }

  public withEmail(email: string): AuthCandidate {
    this.email = email;
    return this;
  }

  public withPassword(pass: string): AuthCandidate {
    this.password = this.encryptPass(pass);
    return this;
  }

  public withPinCode(pinCode: string): AuthCandidate {
    if (pinCode) {
      this.pin = pinCode;
      this.isPinRequired = true;
    }
    return this;
  }

  public build(): AuthCandidate {
    return this;
  }

  private encryptPass(pass: string): string {
    return new UtilsService().encodePassword(pass, environment.encodeKey);
  }

}
