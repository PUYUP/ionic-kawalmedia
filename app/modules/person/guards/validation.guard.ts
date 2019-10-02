import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

// LOCAL SERVICE
import { PersonService } from '../services/person.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationGuard implements CanActivate {

  constructor(
    private personService: PersonService,
    private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.personService.getLocalToken().verified_mail == true && this.personService.getLocalToken().verified_telp == true) {
      // Navigate to profile page
      this.router.navigate(['/profile']);
    }

    // Passed
    return true;
  }

}
