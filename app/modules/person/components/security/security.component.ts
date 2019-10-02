import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ToastController, AlertController } from '@ionic/angular';

// LOCAL SERVICES
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {

  @Input('personData') personData: any;
  @ViewChildren('basicInput') basicInput: QueryList<ElementRef>;

  createFormGroup: any;
  initLoading: boolean = false;
  isLoading: boolean = false;
  isSaveLoading: boolean = false;
  basicLoading: boolean = false;
  indexEdited: any;
  hasBasicOptions: boolean = false;
  basicOptions: any;
  editValue: any = [];
  secureCode: any;
  oldValue: any;
  toast: any;
  alert: any;

  constructor(
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public alertController: AlertController,
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

  ngOnInit() {
    console.log(this.personData);
    this.getBasicOptions();
  }

  getBasicOptions(): any {
    this.basicLoading = true;
    this.personService.getBasicOptions()
      .pipe(
        finalize(() => {
          this.basicLoading = false;
        })
      )
      .subscribe(
        response => {
          this.hasBasicOptions = true;
          this.basicOptions = response;

          for (let opt of this.basicOptions) {
            this.editValue.push(opt.value);
          }
        },
        failure => {

        }
      );
  }

  editBasic(event: any, option: any, index: number): any {
    this.oldValue = this.basicOptions[index].value;
    this.indexEdited = index;
  }

  editCancel(event: any, option: any, index: number): any {
    this.indexEdited = 999999;
    this.editValue[index] = this.oldValue;
  }

  saveBasic(event: any, option: any, index: number): any {
    const value = this.editValue[index];
    if (this.personData) option.uuid = this.personData.uuid;
    option.action = 'update_basic';
    option.new_value = value;
    this.isSaveLoading = true;

    // Important change need validation by email
    if (option.is_secured === true) {
      // We need check this value used or not (email and username)
      if (option.identifier === 'username' || option.identifier === 'email') {
        // option.value = value;
        this.changeCheck(option, index);
      } else {
        this.changeModal(option, index);
      }
    }
  }

  /***
   * Special access need secure code
   * This send a secure code to user
   */
  requestChange(option: any): any {
    option.action = 'secure_validation';
    option.secure_code_init = this.secureCode;

    this.personService.requestChange(option)
      .pipe(
        finalize(() => {
          this.isSaveLoading = false;
        })
      )
      .subscribe(
        (response: { secure_code: any; }) => {
          this.secureCode = response.secure_code;
        },
        (failure: any) => {
          // Passed
        }
      );
  }

  /***
   * Prompt request change
   */
  async presentAlertPrompt(option: any, index: any) {
    this.alert = await this.alertController.create({
      header: 'Tindakan Diperlukan',
      backdropDismiss: false,
      keyboardClose: false,
      message: 'Kode otentikasi dikirim. Periksa kotak masuk email Anda.',
      inputs: [
        {
          name: 'secure_code',
          type: 'text',
          placeholder: 'Kode Otentikasi',
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            this.editValue[index] = this.basicOptions[index].value;
            this.indexEdited = 999999;
          }
        }, {
          text: 'Simpan',
          handler: (alertData) => {
            const secureCode = alertData.secure_code;
            this.validateAction(secureCode, option, index);
            return false;
          }
        }
      ]
    });

    await this.alert.present().then(() => {
      this.requestChange(option);
    });
  }

  /***
   * Prompt verifiaction
   */
  async presentVerificationPrompt(option: any, verificationData: any) {
    const verifiaction = verificationData.verification;
    let message = 'Kode otentikasi dikirim. Periksa email Anda.';
    if (verifiaction === 'telp') message = 'Kode otentikasi dikirim. Periksa handphone Anda.';

    this.alert = await this.alertController.create({
      header: 'Verifikasi',
      backdropDismiss: false,
      keyboardClose: false,
      message: message,
      inputs: [
        {
          name: 'secure_code',
          type: 'text',
          placeholder: 'Kode Otentikasi'
        }
      ],
      buttons: [
        {
          text: 'Verifikasi',
          handler: (alertData) => {
            const secureCode = alertData.secure_code;
            this.validateVerification(secureCode, verificationData);
            return false;
          }
        }, {
          text: 'Kirim Ulang',
          handler: () => {
            this.resendVerification(option);
            return false;
          }
        }, {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            // Pass
          }
        }
      ]
    });

    await this.alert.present();
  }

  changeModal(option: any, index: number): any {
    this.presentAlertPrompt(option, index);
  }

  changeCheck(option: any, index: number): any {
    const value = this.editValue[index];
    option.action = 'change_check';
    option.new_value = value;

    this.personService.changeCheck(option)
      .pipe(
        finalize(() => {
          this.isSaveLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.changeModal(option, index);
        },
        (failure: { error: { detail: any; }; statusText: any; }) => {
          let message = (failure.error && failure.error.detail ? failure.error.detail : failure.statusText);
          this.presentToast(message);
        }
      );
  }

  /***
   * Let's validate security code for update
   */
  validateAction(secure_code: string, option: any, index: any): any {
    this.isLoading = true;
    option.secure_code = secure_code;
    option.action = 'update_basic';

    this.personService.postUpdateOption(option)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        response => {
          // Show notification...
          this.presentToast('Menyimpan berhasil.');
          this.alert.dismiss();

          // Clear secure code
          this.secureCode = null;

          // Replace username in localStorage
          if (option.identifier === 'username') {
            this.personData.username = response.new_value;
            this.personService.setLocalData('credentialsKey', this.personData);
          }

          this.editValue[index] = response.new_value;
          this.basicOptions[index].value = response.new_value;
          this.indexEdited = 999999;
        },
        failure => {
          this.presentToast('Gagal menyimpan. Kode otentikasi salah.');
        }
      );
  }

  /***
   * Account verification
   * Send verification code to Email or Telephone number
   */
  verification(event: any, option: any): any {
    this.sendVerification(option, false);
  }

  /***
   * Resend verification
   */
  resendVerification(option: any): any {
    this.sendVerification(option, true);
  }

  /***
   * Send a verification code
   */
  sendVerification(option: any, resend: any): any {
    const email = (option.identifier === 'email' ? option.value : '');
    const telephone = (option.identifier === 'telephone' ? option.value : '');

    let verification = 'mail';
    if (option.identifier === 'telephone') verification = 'telp';

    const verificationData = {
      'action': 'account_verification',
      'secure_code': this.personData.auth_code,
      'verification': verification,
      'email': email,
      'telephone': telephone,
    }

    this.personService.postSendValidation(verificationData)
      .pipe(
        finalize(() => {
          // Pass
        })
      )
      .subscribe(
        response => {
          this.presentToast(response.detail);
          this.secureCode = response.secure_code;

          if (resend === false) {
            this.presentVerificationPrompt(option, verificationData);
          }
        },
        failure => {
          let message = (failure.error.detail ? failure.error.detail : failure.statusText);
          this.presentToast(message);
        }
      );
  }

  /***
   * Validate security code for verification
   */
  validateVerification(secureCode: string, verificationData: any): any {
    const verification = verificationData.verification;
    this.personService.postValidation({
      'action': 'account_verification',
      'verification': verification,
      'secure_code': secureCode,
    })
      .pipe(
        finalize(() => {
          // Pass
        })
      )
      .subscribe(
        response => {
          this.presentToast(response.detail);
          this.alert.dismiss();

          // Clear secure code
          this.secureCode = null;

          // Update person localStorage
          if (verification === 'mail') this.personData.verified_mail = true;
          if (verification === 'telp') this.personData.verified_telp = true;

          this.personService.setLocalData('tokenKey', this.personData);
        },
        failure => {
          let message = (failure.error.detail ? failure.error.detail : failure.statusText);
          this.presentToast(message);
        }
      );
  }

}
