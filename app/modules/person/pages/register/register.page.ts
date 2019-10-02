import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

// LOCAL SERVICES
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  createFormGroup: any = FormGroup;
  isLoading: boolean = false;
  loadingModal: any;
  toast: any;
  errorMessage: any;
  usernameErrors: any;
  emailErrors: any;
  telephoneErrors: any;
  passwordErrors: any;

  constructor(
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    private router: Router,
    private personService: PersonService) { }

  ngOnInit() {
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
   * Initialize form
   */
  createForm(): void {
    this.createFormGroup = this.formBuilder.group({
      username: [
        '',
        [
          Validators.pattern('[a-zA-Z0-9]*'),
          Validators.minLength(3),
          Validators.maxLength(15),
          Validators.required
        ]
      ],
      email: ['', [Validators.email, Validators.required]],
      telephone: [
          '',
        [
          Validators.pattern('[0-9]*'),
          Validators.minLength(10),
          Validators.maxLength(14),
          Validators.required
        ]
      ],
      password: ['', [Validators.minLength(6), Validators.required]],
    });
  }

  /***
   * Submit form
   */
  formSubmit(): void {
    // Present loader...
    this.isLoading = true;

    this.personService.postRegister(this.createFormGroup.value)
      .pipe(
        finalize(() => {
          this.createFormGroup.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        response => {
          // Save this process
          const data = {
            'secure_code': response.secure_code,
            'process': 'register',
          }

          this.personService.setLocalData('registerProgess', data);
          this.router.navigate(['/validation'], {replaceUrl: true});
        },
        failure => {
          if (failure.error) {
            const error: any = failure.error;
            for (let e in error) {
              let msg = error[e];
              if (msg) {
                this.errorMessage = msg.join('');
              }
            }

            this.presentToast(this.errorMessage);
          }
        }
      );
  }

  get email() { return this.createFormGroup.get('email'); }
  get telephone() { return this.createFormGroup.get('telephone'); }
  get username() { return this.createFormGroup.get('username'); }
  get password() { return this.createFormGroup.get('password'); }

  /***
   * Check username errors
   */
  usernameCheck(event: any): any {
    let errors = this.username.errors;
    
    // Reset
    this.usernameErrors = [];
  
    for (let e in errors) {
      if (e === 'required') {
        this.usernameErrors.push('Nama pengguna <strong>wajib</strong>.');
      }

      if (e === 'pattern') {
        this.usernameErrors.push('Hanya boleh angka 0-9 dan karakter a-Z.');
      }

      if (e === 'minlength') {
        this.usernameErrors.push('Minimal 4 karakter.');
      }

      if (e === 'maxlength') {
        this.usernameErrors.push('Maksimal 15 karakter.');
      }
    }
  }

  /***
   * Check email errors
   */
  emailCheck(event: any): any {
    let errors = this.email.errors;
    
    // Reset
    this.emailErrors = [];
  
    for (let e in errors) {
      if (e === 'required') {
        this.emailErrors.push('Alamat email <strong>wajib</strong>.');
      }

      if (e === 'email') {
        this.emailErrors.push('Tidak valid.');
      }
    }
  }

  /***
   * Check telephone errors
   */
  telephoneCheck(event: any): any {
    let errors = this.telephone.errors;
    
    // Reset
    this.telephoneErrors = [];
  
    for (let e in errors) {
      if (e === 'required') {
        this.telephoneErrors.push('Nomor handphone <strong>wajib</strong>.');
      }

      if (e === 'pattern') {
        this.telephoneErrors.push('Hanya boleh angka 0-9.');
      }

      if (e === 'minlength') {
        this.telephoneErrors.push('Minimal 10 digit.');
      }

      if (e === 'maxlength') {
        this.telephoneErrors.push('Maksimal 14 digit.');
      }
    }
  }

  /***
   * Check password errors
   */
  passwordCheck(event: any): any {
    let errors = this.password.errors;
    
    // Reset
    this.passwordErrors = [];
  
    for (let e in errors) {
      if (e === 'required') {
        this.passwordErrors.push('Kata sandi wajib <strong>wajib</strong>.');
      }

      if (e === 'minlength') {
        this.passwordErrors.push('Minimal 6 karakter.');
      }
    }
  }

}
