import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ToastController, AlertController } from '@ionic/angular';

// LOCAL SERVICES
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage implements OnInit {

  createFormGroup: any = FormGroup;
  isLoading: boolean = false;
  isLoadingResend: boolean = false;
  recoveryData: any;
  secureCode: any;
  toast: any;
  email: string;

  constructor(
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private personService: PersonService) {

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.email = this.router.getCurrentNavigation().extras.state.email;
      }
    });
  }

  ngOnInit() {
    this.recoveryData = this.personService.getLocalData('recoveryData');
    this.recoveryData = (this.recoveryData ? this.recoveryData : '');
    this.secureCode = (this.recoveryData ? this.recoveryData.secure_code : '');
    this.createForm();
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

  /***
   * Prompt request new password
   */
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Tindakan Diperlukan',
      backdropDismiss: false,
      keyboardClose: false,
      inputs: [
        {
          name: 'email',
          type: 'email',
          value: this.email,
          placeholder: 'Alamat email Anda'
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Minta Kata Sandi',
          handler: (alertData) => {
            this.email = alertData.email;
            this.postRequestPassword(this.email);
          }
        }
      ]
    });

    await alert.present();
  }

  createForm(): void {
    this.createFormGroup = this.formBuilder.group({
      secure_code: ['', [Validators.required]],
      password1: ['', [Validators.minLength(6), Validators.required]],
      password2: ['', [Validators.minLength(6), Validators.required]],
    });
  }

  formSubmit(): any {
    const password1 = this.createFormGroup.value.password1;
    const password2 = this.createFormGroup.value.password2;
    const secure_code = this.createFormGroup.value.secure_code;

    if (password1 !== password2) {
      this.presentToast('Kata sandi tidak sama.');
      return false;
    }

    this.isLoading = true;
    this.personService.postPasswordRecovery(this.createFormGroup.value)
      .pipe(
        finalize(() => {
          this.createFormGroup.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        response => {
          // Remove data from localStorage
          this.personService.deleteLocalData('registerProgess');
          this.personService.deleteLocalData('recoveryData');
          this.router.navigate(['/login'], { replaceUrl: true });
        },
        failure => {
          let message = (failure.error.detail ? failure.error.detail : failure.statusText);
          this.presentToast(message);
        }
      );
  }

  passwordResend(): any {
    this.presentAlertPrompt();
  }

  /***
   * Request reset password
   */
  postRequestPassword(email: any): any {
    this.isLoadingResend = true;
    this.personService.postRequestPassord({
      'email': email,
      'action': 'password_request',
    })
      .pipe(
        finalize(() => {
          this.isLoadingResend = false;
        })
      )
      .subscribe(
        (response: { detail: any; secure_code: any; }) => {
          this.presentToast(response.detail);
        },
        (failure: { error: { detail: any; }; statusText: any; }) => {
          let message = (failure.error.detail ? failure.error.detail : failure.statusText);
          this.presentToast(message);
        }
      );
  }

  get secure_code() { return this.createFormGroup.get('secure_code'); }
  get password1() { return this.createFormGroup.get('password1'); }
  get password2() { return this.createFormGroup.get('password2'); }

}
