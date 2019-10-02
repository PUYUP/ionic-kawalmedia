import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SubmitMediaPage } from './submit-media.page';

// Guards
import { LoginGuard } from '../../../person/guards/login.guard';

// Component
import { SubmitMediaComponent } from '../../components/submit-media/submit-media.component';

// Modules
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: 'submit',
    component: SubmitMediaPage,
    canActivate: [LoginGuard]
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
    SubmitMediaPage,
    SubmitMediaComponent
  ],
  entryComponents: [
    SubmitMediaComponent
  ],
})
export class SubmitMediaPageModule {}
