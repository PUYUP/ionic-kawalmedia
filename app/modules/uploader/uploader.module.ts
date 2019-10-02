import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PickupComponent } from './pickup/pickup.component';
import { SharedModule } from '../shared/shared.module';

// Ng Upload
import { FileUploadModule } from 'ng2-file-upload';

// Cropped
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    PickupComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,

    // Uploader
    FileUploadModule,

    // Cropped
    ImageCropperModule
  ],
  exports: [
    PickupComponent
  ],
  entryComponents: [
    PickupComponent
  ]
})
export class UploaderModule { }
