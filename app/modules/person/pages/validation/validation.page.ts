import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, switchMap, finalize, combineLatest } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

// LOCAL SERVICES
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.page.html',
  styleUrls: ['./validation.page.scss'],
})
export class ValidationPage implements OnInit {

  createFormGroup: any = FormGroup;
  isLoading: boolean = false;
  isLoadingResend: boolean = false;
  registerData: any;
  personData: any;
  secure_code: string;
  toast: any;

  constructor(
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    private router: Router,
    private personService: PersonService) {
  }

  /***
   * Show toast message
   */
  async presentToast(message: string) {
    this.toast = await this.toastController.create({
      header: 'Informasi',
      message: message,
      duration: 2000
    });

    this.toast.present();
  }

  ngOnInit() {
    this.registerData = this.personService.getLocalData('registerProgess');
    this.personData = (this.registerData ? this.registerData : '');
    this.createForm();

    /***
    if (this.personData) {
      this.secure_code = this.personData.secure_code;
    } else {
      // Redirect to login page
      this.router.navigate(['/login']);
    } */
  }

  createForm(): void {
    this.createFormGroup = this.formBuilder.group({
      secure_code: ['', Validators.required],
    });
  }

  formSubmit(): any {
    // Value from input
    const secure_code = this.createFormGroup.value.secure_code;
    if (secure_code !== this.secure_code) {
      this.presentToast('Kode otentikasi salah.');
      return false;
    }

    this.isLoading = true;
    this.createFormGroup.value.action = 'account_verification';
    this.createFormGroup.value.verification = 'mail';

    this.personService.postValidation(this.createFormGroup.value)
      .pipe(
        finalize(() => {
          this.createFormGroup.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        response => {
          // Delete localStorage
          this.personService.deleteLocalData('registerProgess');
          this.router.navigate(['/login']);
        },
        failure => {
          let message = (failure.error.detail ? failure.error.detail : failure.statusText);
          this.presentToast(message);
        }
      );
  }

  sendValidation(): void {
    this.isLoadingResend = true;
    this.personService.postSendValidation({
      'secure_code': this.secure_code,

    })
      .pipe(
        finalize(() => {
          this.createFormGroup.markAsPristine();
          this.isLoadingResend = false;
        })
      )
      .subscribe(
        response => {
          // Update verification code
          this.secure_code = response.secure_code;
          this.registerData.process = 'verification';
          this.registerData.secure_code = response.secure_code;

          // Save this process
          this.personService.setLocalData('registerProgess', this.registerData);
          this.presentToast(response.detail);
        },
        failure => {
          let message = (failure.error.detail ? failure.error.detail : failure.statusText);
          this.presentToast(message);
        }
      );
  }

}
