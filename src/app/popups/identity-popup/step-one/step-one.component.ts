import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMyDpOptions } from 'mydatepicker';
import { PopupService } from '../../../shared/services/popup.service';
import { UserVerificationService } from '../../../shared/services/user-verification.service';
import { UserInfoVerificationModel } from '../user-info-verification.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
})
export class StepOneComponent implements OnInit, OnDestroy {
  @Output() nextStep = new EventEmitter<number>();
  form: FormGroup;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
    // height: '45px'
  };
  public model: any = { date: { year: 2018, month: 10, day: 9 } };
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private popupService: PopupService, private verificationService: UserVerificationService) {}

  ngOnInit() {
    this.form = new FormGroup({
      firstName: new FormControl('', { validators: [Validators.required] }),
      lastName: new FormControl('', { validators: [Validators.required] }),
      born: new FormControl(null, { validators: [Validators.required] }),
      address: new FormControl('', { validators: [Validators.required] }),
      postalCode: new FormControl('', { validators: [Validators.required] }),
      country: new FormControl('', { validators: [Validators.required] }),
      city: new FormControl('', { validators: [Validators.required] }),
    });

    // todo remove after testing
    this.patchTestData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  moveNext() {
    // this.nextStep.emit(2);

    const entity = UserInfoVerificationModel.builder()
      .withFormGroup(this.form)
      .build();
    console.log(JSON.stringify(entity));
    this.verificationService
      .uploadVerificationInfo(entity)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => {
          console.log(res);
          this.nextStep.emit(2);
        },
        error1 => {
          console.error(error1);
        }
      );
  }

  onSubmit() {
    this.moveNext();
  }

  // todo remove
  private patchTestData() {
    this.form.get('firstName').patchValue('FirstName');
    this.form.get('lastName').patchValue('LastName');
    this.form.get('born').patchValue(new Date());
    this.form.get('address').patchValue('Residential Address');
    this.form.get('postalCode').patchValue('7546743');
    this.form.get('country').patchValue('Kazahstan');
    this.form.get('city').patchValue('Astana');
  }
}
