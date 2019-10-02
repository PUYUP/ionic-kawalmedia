import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController, AlertController, Events } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

// LOCAL SERVICES
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  createFormGroup: any = FormGroup;
  isLoading: boolean = false;
  isLoadingResend: boolean = false;
  toast: any;

  constructor(
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public alertController: AlertController,
    public events: Events,
    private router: Router,
    private personService: PersonService) { }

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
            const email = alertData.email;
            this.postRequestPassword(email);
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.createFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  formSubmit(): void {
    this.isLoading = true;
    this.personService.postLogin(this.createFormGroup.value)
      .pipe(
        finalize(() => {
          this.createFormGroup.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.router.navigate(['/home'], { replaceUrl: true });
          this.events.publish('loginEvent', response);
        },
        (failure: { error: { detail: any; }; statusText: any; }) => {
          let message = (failure.error && failure.error.detail ? failure.error.detail : failure.statusText);
          this.presentToast(message);
        }
      );
  }

  /***
   * Prompt request new password
   */
  passwordRecovery(): void {
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
          let navigationExtras: NavigationExtras = {
            replaceUrl: true,
            state: {
              email: email
            }
          };

          this.router.navigate(['/password-recovery'], navigationExtras);

          // Save email
          const data = { 'secure_code': response.secure_code }
          this.personService.setLocalData('recoveryData', data);
        },
        (failure: { error: { detail: any; }; statusText: any; }) => {
          let message = (failure.error.detail ? failure.error.detail : failure.statusText);
          this.presentToast(message);
        }
      );
  }

}
