import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IMyDpOptions} from 'mydatepicker';
import {UserVerificationModel} from '../user-verification.model';
import {PopupService} from '../../../services/popup.service';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  @Output() nextStep = new EventEmitter<number>();
  @Output() createVerificationEntity = new EventEmitter<UserVerificationModel>();
  form: FormGroup;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
    // height: '45px'
  };
  public model: any = { date: { year: 2018, month: 10, day: 9 } };

  constructor(private popupService: PopupService) { }

  ngOnInit() {
    this.form = new FormGroup({
      'firstName': new FormControl('', {validators: [Validators.required]}),
      'lastName': new FormControl('', {validators: [Validators.required]}),
      'born': new FormControl(null, {validators: [Validators.required]}),
      'address': new FormControl('', {validators: [Validators.required]}),
      'postalCode': new FormControl('', {validators: [Validators.required]}),
      'country': new FormControl('', {validators: [Validators.required]}),
      'city': new FormControl('', {validators: [Validators.required]}),
    });

    // todo remove after testing
    this.patchTestData();
  }

  moveNext() {
    this.nextStep.emit(2);
    const entity = UserVerificationModel
      .builder()
      .withFormFroup(this.form)
      .withDocumentType(this.popupService.getIdentityDocumentType())
      .build();
    this.createVerificationEntity.emit(entity);
  }

  onSubmit() {
    this.moveNext();
  }


  // todo remove
  private patchTestData() {
    this.form.get('firstName').patchValue('FirstName');
    this.form.get('lastName').patchValue('LastName');
    this.form.get('born').patchValue('12.11.1976');
    this.form.get('address').patchValue('Residential Address');
    this.form.get('postalCode').patchValue('7546743');
    this.form.get('country').patchValue('Kazahstan');
    this.form.get('city').patchValue('Astana');
  }
}
