import { FormGroup } from '@angular/forms';

export class UserVerificationModel {

  userId: number;
  documentType: string;
  firstName: string;
  lastName: string;
  born: Date;
  residentialAddress: string;
  postalCode: string;
  country: string;
  city: string;
  filePath: string;

  constructor(userId: number) {
    this.userId = userId;
  }

  public static builder(): UserVerificationModel {
    return new UserVerificationModel(0);
  }

  public withFormFroup(form: FormGroup): UserVerificationModel {
    this.firstName = form.get('firstName').value;
    this.lastName = form.get('lastName').value;
    this.born = form.get('born').value.formatted;
    this.residentialAddress = form.get('address').value;
    this.postalCode = form.get('postalCode').value;
    this.country = form.get('country').value;
    this.city = form.get('city').value;
    return this;
  }

  public withDocumentType(type: string): UserVerificationModel {
    this.documentType = type;
    return this;
  }

  public withFilePath(filePath: string): UserVerificationModel {
    this.filePath = filePath;
    return this;
  }

  public build(): UserVerificationModel {
    return this;
  }
}
