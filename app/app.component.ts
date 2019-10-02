import { Component } from '@angular/core';
import { Platform, MenuController, Events, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

// LOCAL SERVICES
import { PersonService } from './modules/person/services/person.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  isLogged: boolean = false;
  appPages: any;
  personData: any;

  constructor(
    public menuCtrl: MenuController,
    public events: Events,
    public router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private personService: PersonService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.isLogged = this.personService.isAuthenticated();

      this.appPages = [
        {
          title: 'Beranda',
          url: '/home',
          icon: 'home',
          restrict: false
        },
        {
          title: 'Media',
          url: '/media',
          icon: 'business',
          restrict: false
        },
        {
          title: 'Laporan',
          url: '/list',
          icon: 'flag',
          restrict: false
        },
        {
          title: 'Tambah Media',
          url: '/submit',
          icon: 'add-circle-outline',
          restrict: false
        },
        {
          title: 'Login',
          url: '/login',
          icon: 'unlock',
          restrict: this.isLogged
        },
        {
          title: 'Daftar',
          url: '/register',
          icon: 'key',
          restrict: this.isLogged
        },
        {
          title: 'Profil',
          url: '/profile',
          icon: 'contact',
          restrict: !this.isLogged
        },
        {
          title: 'Logout',
          url: '/logout',
          icon: 'log-out',
          restrict: !this.isLogged
        }
      ];

      this.events.subscribe('loginEvent', (data) => {
        this.isLogged = true;
        this.appMenuLogin();
      });
    });
  }

  logout(): void {
    this.isLogged = false;
    this.menuCtrl.toggle();
    this.appMenuLogout();
    this.router.navigate(['/home'], {replaceUrl: true});
  
    this.personService.postLogout()
      .pipe(
        finalize(() => {
          // Pass
        })
      )
      .subscribe(
        _response => {
          // Pass
        },
        _failure => {
          // Pass
        }
      );
  }

  appMenuLogout(): any {
    // Logout
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/logout';
    });
    this.appPages[index].restrict = true;

    // Profile
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/profile';
    });
    this.appPages[index].restrict = true;

    // Login
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/login';
    });
    this.appPages[index].restrict = false;

    // Register
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/register';
    });
    this.appPages[index].restrict = false;
  }

  appMenuLogin(): any {
    // Logout
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/logout';
    });
    this.appPages[index].restrict = false;

    // Profile
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/profile';
    });
    this.appPages[index].restrict = false;

    // Login
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/login';
    });
    this.appPages[index].restrict = true;

    // Register
    var index = this.appPages.findIndex((key: any) => {
      return key.url === '/register';
    });
    this.appPages[index].restrict = true;
  }

}
