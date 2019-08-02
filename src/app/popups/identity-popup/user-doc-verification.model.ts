import { FormGroup } from '@angular/forms';

export class UserDocVerificationModel {
  userId: number;
  documentType: string;
  encoded: string;

  constructor(userId: number) {
    this.userId = userId;
  }

  public static builder(): UserDocVerificationModel {
    return new UserDocVerificationModel(0);
  }

  public withDocumentType(docType: string): UserDocVerificationModel {
    this.documentType = docType;
    return this;
  }

  public withEncoded(encoded: string): UserDocVerificationModel {
    this.encoded = encoded;
    return this;
  }

  public build(): UserDocVerificationModel {
    return this;
  }
}
