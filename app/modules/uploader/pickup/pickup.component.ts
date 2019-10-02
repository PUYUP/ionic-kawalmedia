import { Component, OnInit, Input } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

// Ng Upload
import { FileUploader, FileItem } from 'ng2-file-upload/ng2-file-upload';
import { ImageCroppedEvent } from 'ngx-image-cropper';

// Environments
import { modulenv as personOption } from '../environment';
import { modulenv as escortOption } from '../../escort/environment';

// PERSON SERVICES
import { PersonService } from '../../person/services/person.service';

// ESCORT SERVICES
import { EscortService } from '../../escort/services/escort.service';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.scss'],
})
export class PickupComponent implements OnInit {

  @Input('personData') personData: any;
  @Input('avatarObj') avatarObj: any;
  @Input('mediaData') mediaData: any;
  @Input('action') action: any;

  uploader: FileUploader = new FileUploader({});
  uuid: any;
  authCode: any;
  filePreview: any;
  imageFile: any;
  hasChanged: boolean = false;
  isLoading: boolean = false;
  ownership: boolean = true;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  identifier: string;
  optionUrl: string;

  constructor(
    private sanitizer: DomSanitizer,
    private personService: PersonService,
    private escortService: EscortService) { }

  ngOnInit() {
    this.authCode = (this.personData ? this.personData.auth_code : '');

    // Avatar loaded
    if (this.action === 'upload_avatar') {
      this.uuid = (this.personData ? this.personData.uuid : '');
      this.identifier = 'avatar';
      this.optionUrl = personOption.optionUrl;
    }

    if (this.avatarObj) {
      this.filePreview = this.avatarObj.value.object;
    }

    // Logo upload
    if (this.action === 'upload_logo') {
      this.uuid = (this.mediaData ? this.mediaData.uuid : '');
      this.identifier = 'logo';
      this.optionUrl = escortOption.optionUrl;
      this.ownership = this.mediaData.ownership;
    }

    if (this.mediaData && this.mediaData.attribute_values) {
      this.filePreview = this.mediaData.attribute_values.logo;
    }

    // Init upload
    this.initUpload();
  }

  initUpload(): any {
    // Start upload
    this.uploader.onAfterAddingFile = (item: FileItem) => {
      let alias: string;
      let method: string;
      const csrftoken = this.personService.getCookie('csrftoken');

      // Upload file
      if (this.action === 'upload_avatar') alias = 'avatar', method = 'PUT';
      if (this.action === 'upload_logo') alias = 'logo', method = 'PUT';

      // Inject!
      item.method = method;
      item.alias = alias;
      item.headers.push({ name: 'X-CSRFTOKEN', value: csrftoken });

      // Has image changed
      this.hasChanged = true;

      // Set options
      const options = {
        url: this.optionUrl + this.uuid + '/',
        authToken: this.authCode,
      }

      this.uploader.setOptions(options);
    };

    // Before upload
    this.uploader.onBeforeUploadItem = (item: FileItem) => {
      let action: string;

      // Upload image, same as update attribute
      if (this.action === 'upload_avatar') action = 'update_attribute';
      if (this.action === 'upload_logo') action = 'update_attribute';

      // Secure action needed
      item.withCredentials = true;

      // File crop ready
      // Override old file
      if (this.imageFile) item._file = this.imageFile;

      this.uploader.options.additionalParameter = {
        action: action,
      };
    };

    // Finish!
    this.uploader.onCompleteItem = (fileItem: any, response: any, status: any, headers: any) => {
      this.showCropper = false;
      this.hasChanged = false;
      this.isLoading = false;

      // Generate preview
      this.filePreview = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));

      // Upload avatar
      if (this.action === 'upload_avatar') {
        this.avatarObj.value.object = this.filePreview;
      }

      // Upload logo
      if (this.action === 'upload_logo') {
        this.mediaData.attribute_values.logo = this.filePreview;
      }
    };
  }

  submitUpload(): any {
    this.isLoading = true;
    this.uploader.uploadAll();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    const imageName = 'image.png';
    const imageFile = new File([event.file], imageName, { type: 'image/png' });

    this.imageFile = imageFile;
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(this.imageFile)));
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded')
  }

  cropperReady() {
    console.log('Cropper ready')
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  cancelUpload() {
    if (this.filePreview) {
      // Upload avatar
      if (this.action === 'upload_avatar') {
        this.filePreview = this.avatarObj.value.object;
      }

      // Upload logo
      if (this.action === 'upload_logo') {
        this.filePreview = this.mediaData.attribute_values.logo;
      }
    }

    this.showCropper = false;
    this.hasChanged = false;
    delete this.croppedImage;
  }

  deleteFile(identifier: any): any {
    this.isLoading = true;

    // Avatar
    if (identifier === 'avatar' || identifier === 'logo') {
      let values = {
        'uuid': this.uuid,
        'action': 'update_attribute',
        [identifier]: null,
      }

      // Upload avatar
      if (this.action === 'upload_avatar') {
        this.personService.postUpdateOption(values)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
          .subscribe(
            (response: any) => {
              this.showCropper = false;
              this.hasChanged = false;
              delete this.filePreview;
              delete this.croppedImage;
              delete this.avatarObj.value.object;
            },
            (failure: any) => {

            }
          );
      }

      // Upload logo
      if (this.action === 'upload_logo') {
        this.escortService.postUpdateOption(values)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
          .subscribe(
            (response: any) => {
              this.showCropper = false;
              this.hasChanged = false;
              delete this.filePreview;
              delete this.croppedImage;
              delete this.mediaData.attribute_values.logo;
            },
            (failure: any) => {

            }
          );
      }
    }
  }

  dataURItoBlob(dataURI: string): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
      dataURI = dataURI.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      const byteString = atob(dataURI);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/png' });
      observer.next(blob);
      observer.complete();
    });
  }

}
