import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.scss']
})
export class DocUploadComponent implements OnInit {

  @Output() showFile = new EventEmitter<boolean>();
  fileToUpload: File = null;
  url = '';

  constructor() {
  }

  ngOnInit() {
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      this.fileToUpload = event.target.files[0];

      if (this.isFileValid()) {
        reader.readAsDataURL(this.fileToUpload); // read file as data url

        reader.onload = (ev: any) => { // called once readAsDataURL is completed
          this.url = ev.target.result;
        };
      } else {
        this.fileToUpload = null;
      }

    }
  }

  isFileValid(): boolean {
    if (this.fileToUpload == null) {
      return false;
    }
    const fileName = this.fileToUpload.name.toLowerCase();
    return fileName.endsWith('.png'.toLowerCase())
      || fileName.endsWith('.jpg'.toLowerCase())
      || fileName.endsWith('.jpeg'.toLowerCase())
      || fileName.endsWith('.tif'.toLowerCase())
      || fileName.endsWith('.gif'.toLowerCase());
  }

}
