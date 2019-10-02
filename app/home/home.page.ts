import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

// LOCAL ENV.
import { environment } from '../../environments/environment';

// PERSON SERVICES
import { PersonService } from '../modules/person/services/person.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  appName: string;
  personData: any;

  constructor(
    public router: Router,
    public alertController: AlertController,
    private personService: PersonService) { }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Verifikasi Email',
      message: 'Tidak dapat berkontribusi. Segera versifikasi akun, kode otentikasi telah dikirim ke email Anda.',
      buttons: [
        {
          text: 'Verifikasi',
          handler: () => {
            this.router.navigate(['/validation'], {replaceUrl: true});
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
    this.appName = environment.appName;
    this.personData = this.personService.getLocalToken();

    if (this.personData && this.personData.verified_mail === false) {
      this.presentAlert();
    }
  }

}
