import { Component, OnInit } from '@angular/core';

// LOCAL SERVICES
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  segment: string = 'option'; // Set default to option
  personData: any;

  constructor(
    private personService: PersonService
  ) { }

  ngOnInit() {
    this.personData = this.personService.getLocalToken();
  }

  segmentChanged(event: any): any {
    this.segment = event.detail.value;
  }

}
