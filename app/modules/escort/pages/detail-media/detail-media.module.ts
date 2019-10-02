import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailMediaPage } from './detail-media.page';
import { DetailMediaComponent } from '../../components/detail-media/detail-media.component';
import { UploaderModule } from '../../../uploader/uploader.module';
import { StarRating } from 'ionic4-star-rating';

const routes: Routes = [
  {
    path: '',
    component: DetailMediaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    UploaderModule
  ],
  exports: [
    StarRating
  ],
  declarations: [
    DetailMediaPage,
    DetailMediaComponent,
    StarRating
  ]
})
export class DetailMediaPageModule {}
