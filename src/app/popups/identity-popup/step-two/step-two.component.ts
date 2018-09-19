import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit {

  @Output() onNextStep = new EventEmitter<number>();
  isWebcamEnabled = false;

  fileToUpload: File = null;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.onNextStep.emit(3);
  }

  toggleWebcam() {
    this.isWebcamEnabled = !this.isWebcamEnabled;
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
}
