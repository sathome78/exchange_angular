import {environment} from '../../environments/environment';

declare var encodePassword: Function;

export class AuthCandidate {

  public password;
  public appKey = 'f966d047-75fb-4458-b9c3-3bd444e452b8';
  public pincode;
  public isPinRequired;

  constructor(public email: string,
              passwordRaw: string) {
    this.email = email;
    this.password = this.encryptPass(passwordRaw);
  }

  private encryptPass(pass: string): string {
    return encodePassword(pass, environment.encodeKey);
  }
}
