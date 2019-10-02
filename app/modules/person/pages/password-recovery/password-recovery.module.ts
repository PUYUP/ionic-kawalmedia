import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../shared/shared.module';
import { PasswordRecoveryPage } from './password-recovery.page';

// Guards
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: 'password-recovery',
    component: PasswordRecoveryPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PasswordRecoveryPage]
})
export class PasswordRecoveryPageModule {}
