import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { UploaderModule } from '../../../uploader/uploader.module';
import { SharedModule } from '../../../shared/shared.module';
import { ProfilePage } from './profile.page';

import { OptionComponent } from '../../components/option/option.component';
import { SecurityComponent } from '../../components/security/security.component';

// Guards
import { LoginGuard } from '../../guards/login.guard';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfilePage,
    canActivate: [LoginGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes),
    UploaderModule
  ],
  declarations: [
    ProfilePage,
    OptionComponent,
    SecurityComponent
  ],
  entryComponents: [
    OptionComponent,
    SecurityComponent
  ],
})
export class ProfilePageModule {}
