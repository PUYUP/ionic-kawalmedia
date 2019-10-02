import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../shared/shared.module';
import { ValidationPage } from './validation.page';

// Guards
import { AuthGuard } from '../../guards/auth.guard';
import { ValidationGuard } from '../../guards/validation.guard';

const routes: Routes = [
  {
    path: 'validation',
    component: ValidationPage,
    // canActivate: [ValidationGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ValidationPage]
})
export class ValidationPageModule {}
