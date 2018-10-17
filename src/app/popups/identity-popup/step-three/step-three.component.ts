import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {UserVerificationService} from '../../../services/user-verification.service';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent implements OnInit {

  WEBCAM = 'WEBCAM';
  FILE = 'FILE';
  STEP = 'STEP';
  isSubmitSuccessful = false;
  submitEventSubject: Subject<string> = new Subject<string>();
  @Output() onNextStep = new EventEmitter<number>();
  displayMode = this.STEP;

  constructor(private verificationService: UserVerificationService) {
  }

  ngOnInit() {
    this.verificationService.setVerificationMode('PHOTO');
  }

  toggleWebcam() {
    this.displayMode = this.WEBCAM;
    console.log(this.displayMode);
  }

  toggleFile() {
    this.displayMode = this.FILE;
    console.log(this.displayMode);
  }

  onSubmit(mode: string) {
    this.submitEventSubject.next(mode);
    setTimeout(this.moveNext(), 3);
  }

  moveNext() {
    if (this.isSubmitSuccessful) {
      this.onNextStep.emit(3);
    }
  }


  processSubmitResult(code: any) {

  }
}
