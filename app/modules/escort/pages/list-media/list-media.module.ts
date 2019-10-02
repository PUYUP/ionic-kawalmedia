import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListMediaPage } from './list-media.page';
import { DetailMediaPage } from '../detail-media/detail-media.page';

// Component
import { ListMediaComponent } from '../../components/list-media/list-media.component';

// Modules
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: 'media',
    children: [
      {
        path: '',
        component: ListMediaPage,
      },
      {
        path: ':uuid',
        component: DetailMediaPage,
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ListMediaPage,
    ListMediaComponent
  ],
  entryComponents: [
    ListMediaComponent
  ]
})
export class ListMediaPageModule {}
