import { FormGroup } from '@angular/forms';

export class UserInfoVerificationModel {

  userId: number;
  firstName: string;
  lastName: string;
  born: string;
  residentialAddress: string;
  postalCode: string;
  country: string;
  city: string;

  constructor(userId: number) {
    this.userId = userId;
  }

  public static builder(): UserInfoVerificationModel {
    return new UserInfoVerificationModel(0);
  }

  public withFormGroup(form: FormGroup): UserInfoVerificationModel {
    this.firstName = form.get('firstName').value;
    this.lastName = form.get('lastName').value;
    // this.born = new Date(form.get('born').value.formatted).toISOString().split('T')[0];
    this.born = new Date().toISOString();
    this.residentialAddress = form.get('address').value;
    this.postalCode = form.get('postalCode').value;
    this.country = form.get('country').value;
    this.city = form.get('city').value;
    return this;
  }

  public build(): UserInfoVerificationModel {
    return this;
  }
}
