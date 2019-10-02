import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonRoutingModule } from './person-routing.module';
import { LoginPageModule } from './pages/login/login.module';
import { RegisterPageModule } from './pages/register/register.module';
import { ValidationPageModule } from './pages/validation/validation.module';
import { PasswordRecoveryPageModule } from './pages/password-recovery/password-recovery.module';
import { ProfilePageModule } from './pages/profile/profile.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PersonRoutingModule,

    LoginPageModule,
    RegisterPageModule,
    ValidationPageModule,
    PasswordRecoveryPageModule,
    ProfilePageModule
  ]
})
export class PersonModule { }
