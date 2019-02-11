import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Observable, Subject} from 'rxjs';
import {UserVerificationService} from '../../../shared/services/user-verification.service';
import {UserDocVerificationModel} from '../user-doc-verification.model';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss']
})
export class WebcamComponent implements OnInit, OnDestroy {

  @Output() showWebcam = new EventEmitter<boolean>();

  @Input() step: Observable<string>;

  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    width: {ideal: 244},
    height: {ideal: 136}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private verificationService: UserVerificationService) {
  }

  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  onSubmit() {
    this.showWebcam.emit(false);
    console.log('On Submut');
    const entity = UserDocVerificationModel
      .builder()
      .withDocumentType(this.verificationService.getVerificationMode())
      .withEncoded(this.webcamImage.imageAsBase64)
      .build();

    this.verificationService.uploadVerificationDoc(entity)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(ok => {
        console.log('OK: fail to upload file');
      },
      err => {
        console.log(err);
      });

  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.log('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  private uploadImageFromWebCam(): File {
    const base64 = this.webcamImage.imageAsBase64;
    if (!base64) {
      return null;
    }
    const date = new Date().valueOf();
    let text = '';
    const allowableCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += allowableCharacters.charAt(Math.floor(Math.random() * allowableCharacters.length));
    }
    const imageName = date + '.' + text + '.jpeg';
    const imageBlob = this.dataURItoBlob(base64);
    return new File([imageBlob], imageName, {type: 'image/jpeg'});
  }

  private dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], {type: 'image/jpeg'});
    return blob;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }


}
